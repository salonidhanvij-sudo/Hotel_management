from datetime import date
from typing import Optional

from fastapi import APIRouter, HTTPException, Query

from database import get_cursor

router = APIRouter(prefix="/rooms", tags=["Rooms"])

ROOM_COLUMNS = "room_id, slug, room_number, name, type, price_per_night, capacity, status"


@router.get("")
def list_rooms(
    type: Optional[str] = None,
    max_price: Optional[int] = Query(None, ge=0),
    guests: Optional[int] = Query(None, ge=1),
):
    """List rooms, with the same filters as the Rooms page."""
    sql = f"SELECT {ROOM_COLUMNS} FROM rooms WHERE 1=1"
    params = []
    if type:
        sql += " AND type = %s"
        params.append(type)
    if max_price is not None:
        sql += " AND price_per_night <= %s"
        params.append(max_price)
    if guests is not None:
        sql += " AND capacity >= %s"
        params.append(guests)
    sql += " ORDER BY price_per_night"

    with get_cursor() as cur:
        cur.execute(sql, params)
        return cur.fetchall()


@router.get("/availability")
def room_availability(
    check_in: date,
    check_out: date,
    guests: int = Query(1, ge=1),
):
    """Rooms that are free for the whole stay (no overlapping active booking)."""
    if check_out <= check_in:
        raise HTTPException(status_code=422, detail="check_out must be after check_in")

    sql = f"""
        SELECT {ROOM_COLUMNS}
        FROM rooms r
        WHERE r.status <> 'maintenance'
          AND r.capacity >= %s
          AND NOT EXISTS (
              SELECT 1 FROM bookings b
              WHERE b.room_id = r.room_id
                AND b.status IN ('pending', 'confirmed')
                AND b.check_in  < %s      -- starts before requested checkout
                AND b.check_out > %s      -- ends after requested check-in
          )
        ORDER BY r.price_per_night
    """
    with get_cursor() as cur:
        cur.execute(sql, (guests, check_out, check_in))
        return cur.fetchall()