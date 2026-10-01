"""
Database layer.

Why this exists (vs. a global connection at import time):
  * The pool is created lazily, so the API still starts if MySQL is down.
  * Each request borrows its own connection, so requests never share a cursor.
  * Every request ends in commit or rollback and the connection is returned.
  * DB problems become clean HTTP errors (503/500) instead of crashes.
"""
import logging
import os
from contextlib import contextmanager

from dotenv import load_dotenv
from fastapi import HTTPException
from mysql.connector import Error, pooling

load_dotenv()
logger = logging.getLogger("grandvista.db")

_pool = None


def _get_pool():
    global _pool
    if _pool is None:
        _pool = pooling.MySQLConnectionPool(
            pool_name="grandvista",
            pool_size=int(os.getenv("DB_POOL_SIZE", "5")),
            host=os.getenv("DB_HOST", "localhost"),
            port=int(os.getenv("DB_PORT", "3306")),
            user=os.getenv("DB_USER", "root"),
            password=os.getenv("DB_PASSWORD", ""),
            database=os.getenv("DB_NAME", "grandvista_db"),
            connection_timeout=5,
        )
    return _pool


@contextmanager
def get_cursor():
    """Yield a dict cursor inside a transaction (commit on success, rollback on error)."""
    try:
        conn = _get_pool().get_connection()
    except Error:
        logger.exception("Could not get a database connection")
        raise HTTPException(status_code=503, detail="Database temporarily unavailable")

    cur = conn.cursor(dictionary=True)
    try:
        yield cur
        conn.commit()
    except HTTPException:
        conn.rollback()
        raise
    except Error:
        conn.rollback()
        logger.exception("Database error")
        raise HTTPException(status_code=500, detail="Database error")
    finally:
        cur.close()
        conn.close()  # returns the connection to the pool


def ping() -> bool:
    """True if the database answers. Never raises."""
    try:
        with get_cursor() as cur:
            cur.execute("SELECT 1")
            cur.fetchone()
        return True
    except Exception:
        return False