import secrets
from decimal import Decimal
from typing import Optional

from fastapi import APIRouter, HTTPException, Query
from mysql.connector import IntegrityError

from database import get_cursor
from schemas import BookingCreate

router = APIRouter(prefix="/bookings", tags=["Bookings"])

TAX_RATE = Decimal("0.12")  # same 12% the website shows

BOOKING_SELECT = """
    SELECT b.booking_ref, c.name AS guest, c.email, r.name AS room, r.slug AS room_slug,
           b.check_in, b.check_out, DATEDIFF(b.check_out, b.check_in) AS nights,
           b.adults, b.children, b.total_amount, b.status, b.created_at
    FROM bookings b
    JOIN customers c ON c.customer_id = b.customer_id
    JOIN rooms r     ON r.room_id     = b.room_id
"""


def _new_ref(cur) -> str:
    for _ in range(10):
        ref = f"GV{secrets.randbelow(90000) + 10000}"
        cur.execute("SELECT 1 FROM bookings WHERE booking_ref = %s", (ref,))
        if not cur.fetchone():
            return ref
    raise HTTPException(status_code=500, detail="Could not generate a booking reference")


@router.post("", status_code=201)
def create_booking(payload: BookingCreate):
    """Create customer + booking + (demo) payment in ONE transaction."""
    nights = (payload.check_out - payload.check_in).days

    with get_cursor() as cur:
        # Lock the room row so two people can't book the same dates at the same moment.
        cur.execute(
            "SELECT room_id, name, price_per_night, capacity, status "
            "FROM rooms WHERE slug = %s FOR UPDATE",
            (payload.room,),
        )
        room = cur.fetchone()
        if not room:
            raise HTTPException(status_code=404, detail="Room not found")
        if room["status"] == "maintenance":
            raise HTTPException(status_code=409, detail="Room is under maintenance")
        if payload.adults + payload.children > room["capacity"]:
            raise HTTPException(
                status_code=422,
                detail=f"{room['name']} sleeps at most {room['capacity']} guests",
            )

        cur.execute(
            """
            SELECT 1 FROM bookings
            WHERE room_id = %s AND status IN ('pending', 'confirmed')
              AND check_in < %s AND check_out > %s
            LIMIT 1
            """,
            (room["room_id"], payload.check_out, payload.check_in),
        )
        if cur.fetchone():
            raise HTTPException(status_code=409, detail="Room is not available for those dates")

        # Guest: reuse by email, otherwise create.
        cur.execute(
            """
            INSERT INTO customers (name, email, phone) VALUES (%s, %s, %s)
            ON DUPLICATE KEY UPDATE name = VALUES(name), phone = VALUES(phone),
                                    customer_id = LAST_INSERT_ID(customer_id)
            """,
            (f"{payload.first_name} {payload.last_name}".strip(), payload.email, payload.phone),
        )
        customer_id = cur.lastrowid

        # Price is calculated on the server - never trust the browser's total.
        subtotal = room["price_per_night"] * nights
        tax = (subtotal * TAX_RATE).quantize(Decimal("0.01"))
        total = subtotal + tax

        ref = payload.booking_ref
        if ref:
            cur.execute("SELECT 1 FROM bookings WHERE booking_ref = %s", (ref,))
            if cur.fetchone():
                ref = None
        ref = ref or _new_ref(cur)

        try:
            cur.execute(
                """
                INSERT INTO bookings (booking_ref, customer_id, room_id, check_in, check_out,
                                      adults, children, status, special_requests, total_amount)
                VALUES (%s, %s, %s, %s, %s, %s, %s, 'confirmed', %s, %s)
                """,
                (ref, customer_id, room["room_id"], payload.check_in, payload.check_out,
                 payload.adults, payload.children, payload.requests, total),
            )
        except IntegrityError:
            raise HTTPException(status_code=409, detail="Duplicate booking reference")
        booking_id = cur.lastrowid

        # Demo payment: only the METHOD is stored. Card numbers / CVV / UPI IDs never reach the DB.
        cur.execute(
            "INSERT INTO payments (booking_id, amount, method, status) VALUES (%s, %s, %s, 'paid')",
            (booking_id, total, payload.payment_method),
        )

    return {
        "booking_ref": ref,
        "room": room["name"],
        "nights": nights,
        "subtotal": float(subtotal),
        "tax": float(tax),
        "total": float(total),
        "status": "confirmed",
    }


@router.get("")
def list_bookings(
    status: Optional[str] = Query(None, pattern="^(pending|confirmed|cancelled)$"),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
):
    sql = BOOKING_SELECT
    params = []
    if status:
        sql += " WHERE b.status = %s"
        params.append(status)
    sql += " ORDER BY b.created_at DESC LIMIT %s OFFSET %s"
    params += [limit, offset]

    with get_cursor() as cur:
        cur.execute(sql, params)
        return cur.fetchall()


@router.get("/{booking_ref}")
def get_booking(booking_ref: str):
    with get_cursor() as cur:
        cur.execute(BOOKING_SELECT + " WHERE b.booking_ref = %s", (booking_ref,))
        row = cur.fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Booking not found")
    return row


@router.patch("/{booking_ref}/cancel")
def cancel_booking(booking_ref: str):
    with get_cursor() as cur:
        cur.execute(
            "SELECT booking_id, status FROM bookings WHERE booking_ref = %s FOR UPDATE",
            (booking_ref,),
        )
        row = cur.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Booking not found")
        if row["status"] == "cancelled":
            raise HTTPException(status_code=409, detail="Booking is already cancelled")

        cur.execute("UPDATE bookings SET status = 'cancelled' WHERE booking_id = %s", (row["booking_id"],))
        cur.execute("UPDATE payments SET status = 'refunded' WHERE booking_id = %s", (row["booking_id"],))
    return {"booking_ref": booking_ref, "status": "cancelled"}