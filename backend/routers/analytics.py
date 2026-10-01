"""
Analytics. SQL does the heavy aggregation, pandas reshapes the results
(e.g. fills months that had zero revenue). Every query is safe on EMPTY
tables - the old version crashed with KeyError when a table had no rows.
"""
import pandas as pd
from fastapi import APIRouter, Query

from database import get_cursor

router = APIRouter(prefix="/analytics", tags=["Analytics"])


# ---------------------------------------------------------------- helpers
def _total_revenue(cur) -> float:
    cur.execute("SELECT COALESCE(SUM(amount), 0) AS total FROM payments WHERE status = 'paid'")
    return round(float(cur.fetchone()["total"]), 2)


def _occupancy_by_type(cur) -> dict:
    """% of sellable rooms occupied TODAY, per room type (date-based, not a status flag)."""
    cur.execute(
        """
        SELECT r.type,
               COUNT(DISTINCT r.room_id) AS total_rooms,
               COUNT(DISTINCT b.room_id) AS occupied
        FROM rooms r
        LEFT JOIN bookings b
               ON b.room_id = r.room_id
              AND b.status IN ('pending', 'confirmed')
              AND CURDATE() >= b.check_in AND CURDATE() < b.check_out
        WHERE r.status <> 'maintenance'
        GROUP BY r.type
        """
    )
    df = pd.DataFrame(cur.fetchall(), columns=["type", "total_rooms", "occupied"])
    if df.empty:
        return {}
    df["rate"] = (df["occupied"].astype(float) / df["total_rooms"].astype(float) * 100).round(1)
    return dict(zip(df["type"], df["rate"]))


def _overall_occupancy(by_type_rows: dict, cur) -> float:
    cur.execute(
        """
        SELECT COUNT(DISTINCT r.room_id) AS total_rooms,
               COUNT(DISTINCT b.room_id) AS occupied
        FROM rooms r
        LEFT JOIN bookings b
               ON b.room_id = r.room_id AND b.status IN ('pending', 'confirmed')
              AND CURDATE() >= b.check_in AND CURDATE() < b.check_out
        WHERE r.status <> 'maintenance'
        """
    )
    row = cur.fetchone()
    total = int(row["total_rooms"] or 0)
    return round(int(row["occupied"] or 0) / total * 100, 1) if total else 0.0


def _avg_stay(cur) -> float:
    cur.execute(
        "SELECT COALESCE(AVG(DATEDIFF(check_out, check_in)), 0) AS avg_days "
        "FROM bookings WHERE status <> 'cancelled'"
    )
    return round(float(cur.fetchone()["avg_days"]), 2)


def _payment_distribution(cur) -> dict:
    cur.execute("SELECT method, COUNT(*) AS n FROM payments WHERE status = 'paid' GROUP BY method")
    df = pd.DataFrame(cur.fetchall(), columns=["method", "n"])
    if df.empty:
        return {}
    df["pct"] = (df["n"].astype(float) / df["n"].astype(float).sum() * 100).round(1)
    return dict(zip(df["method"], df["pct"]))


def _top_customers(cur, limit: int = 5) -> list:
    cur.execute(
        """
        SELECT c.name, COUNT(DISTINCT b.booking_id) AS bookings, SUM(p.amount) AS spent
        FROM customers c
        JOIN bookings b ON b.customer_id = c.customer_id
        JOIN payments p ON p.booking_id  = b.booking_id AND p.status = 'paid'
        GROUP BY c.customer_id, c.name
        ORDER BY spent DESC
        LIMIT %s
        """,
        (limit,),
    )
    return [
        {"name": r["name"], "bookings": int(r["bookings"]), "spent": round(float(r["spent"]), 2)}
        for r in cur.fetchall()
    ]


def _monthly_revenue(cur, months: int) -> list:
    """Revenue per month for the last N months, with zero-revenue months filled in."""
    start = (pd.Timestamp.today().to_period("M") - (months - 1)).to_timestamp().date()
    cur.execute(
        """
        SELECT DATE_FORMAT(paid_at, '%%Y-%%m') AS month, SUM(amount) AS revenue
        FROM payments
        WHERE status = 'paid' AND paid_at >= %s
        GROUP BY month ORDER BY month
        """,
        (start,),
    )
    df = pd.DataFrame(cur.fetchall(), columns=["month", "revenue"])
    wanted = pd.period_range(end=pd.Timestamp.today(), periods=months, freq="M").strftime("%Y-%m")
    series = (
        df.set_index("month")["revenue"].astype(float)
        if not df.empty
        else pd.Series(dtype=float)
    )
    series = series.reindex(wanted, fill_value=0.0)
    return [{"month": m, "revenue": round(float(v), 2)} for m, v in series.items()]


def _revenue_by_room_type(cur) -> dict:
    cur.execute(
        """
        SELECT r.type, SUM(p.amount) AS revenue
        FROM payments p
        JOIN bookings b ON b.booking_id = p.booking_id
        JOIN rooms r    ON r.room_id    = b.room_id
        WHERE p.status = 'paid'
        GROUP BY r.type
        """
    )
    return {r["type"]: round(float(r["revenue"]), 2) for r in cur.fetchall()}


def _room_status_counts(cur) -> dict:
    """Today's picture: occupied (by active booking) / available / cleaning / maintenance."""
    cur.execute(
        """
        SELECT r.status,
               EXISTS (
                   SELECT 1 FROM bookings b
                   WHERE b.room_id = r.room_id AND b.status IN ('pending', 'confirmed')
                     AND CURDATE() >= b.check_in AND CURDATE() < b.check_out
               ) AS occupied
        FROM rooms r
        """
    )
    counts = {"available": 0, "occupied": 0, "cleaning": 0, "maintenance": 0}
    for row in cur.fetchall():
        if row["status"] in ("maintenance", "cleaning"):
            counts[row["status"]] += 1
        elif row["occupied"]:
            counts["occupied"] += 1
        else:
            counts["available"] += 1
    return counts


# -------------------------------------------------------------- endpoints
@router.get("/dashboard")
def dashboard(months: int = Query(6, ge=1, le=24)):
    """
    Everything the admin dashboard needs in ONE request.
    The first four keys are unchanged from your original API, so the
    current dashboard.js keeps working.
    """
    with get_cursor() as cur:
        by_type = _occupancy_by_type(cur)
        cur.execute("SELECT COUNT(*) AS n FROM bookings")
        total_bookings = int(cur.fetchone()["n"])
        cur.execute("SELECT COUNT(*) AS n FROM customers")
        total_guests = int(cur.fetchone()["n"])

        return {
            # original keys
            "total_revenue": _total_revenue(cur),
            "occupancy_rate": by_type,
            "average_stay_days": _avg_stay(cur),
            "payment_distribution": _payment_distribution(cur),
            # new
            "overall_occupancy": _overall_occupancy(by_type, cur),
            "total_bookings": total_bookings,
            "total_guests": total_guests,
            "room_status": _room_status_counts(cur),
            "monthly_revenue": _monthly_revenue(cur, months),
            "revenue_by_room_type": _revenue_by_room_type(cur),
            "top_customers": _top_customers(cur),
        }


@router.get("/revenue")
def revenue():
    with get_cursor() as cur:
        return {"total_revenue": _total_revenue(cur)}


@router.get("/revenue/monthly")
def revenue_monthly(months: int = Query(6, ge=1, le=24)):
    with get_cursor() as cur:
        return _monthly_revenue(cur, months)


@router.get("/occupancy")
def occupancy():
    with get_cursor() as cur:
        return _occupancy_by_type(cur)


@router.get("/stay_duration")
def stay_duration():
    with get_cursor() as cur:
        return {"average_stay_days": _avg_stay(cur)}


@router.get("/top_customers")
def top_customers(limit: int = Query(5, ge=1, le=50)):
    with get_cursor() as cur:
        return _top_customers(cur, limit)


@router.get("/payment_methods")
def payment_methods():
    with get_cursor() as cur:
        return _payment_distribution(cur)