import logging
import os

from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from database import ping
from routers import analytics, bookings, rooms

load_dotenv()
logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")
logger = logging.getLogger("grandvista")

app = FastAPI(title="GrandVista Hotel API", version="1.0.0")

# CORS: lets your pages (Live Server on :5500 / :5501) call this API from the browser.
DEFAULT_ORIGINS = (
    "http://127.0.0.1:5500,http://localhost:5500,"
    "http://127.0.0.1:5501,http://localhost:5501"
)
origins = [o.strip() for o in os.getenv("CORS_ORIGINS", DEFAULT_ORIGINS).split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["GET", "POST", "PATCH", "OPTIONS"],
    allow_headers=["*"],
)


@app.exception_handler(Exception)
async def unhandled_error(request: Request, exc: Exception):
    # Last safety net: log it, return clean JSON, keep the server alive.
    logger.exception("Unhandled error on %s %s", request.method, request.url.path)
    return JSONResponse(status_code=500, content={"detail": "Internal server error"})


app.include_router(rooms.router)
app.include_router(bookings.router)
app.include_router(analytics.router)


@app.get("/")
def home():
    return {"message": "GrandVista Hotel API running", "docs": "/docs"}


@app.get("/health")
def health():
    """Always returns 200 so you can see the API is up even if MySQL is down."""
    return {"status": "ok", "database": "up" if ping() else "down"}