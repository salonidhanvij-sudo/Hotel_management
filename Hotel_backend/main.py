from fastapi import FastAPI
import mysql.connector
import pandas as pd

app = FastAPI()

# Connect to MySQL
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="root",   # replace with your MySQL password
    database="hotel_db"
)
cursor = db.cursor(dictionary=True)

@app.get("/")
def home():
    return {"message": "Hotel Backend Running"}


@app.get("/rooms")
def get_rooms():
    cursor.execute("SELECT * FROM rooms")
    rows = cursor.fetchall()
    return rows



@app.get("/analytics/revenue")
def revenue():
    cursor.execute("SELECT amount FROM payments")
    rows = cursor.fetchall()
    df = pd.DataFrame(rows)
    total = df["amount"].sum()
    return {"total_revenue": float(total)}

@app.get("/analytics/occupancy")
def occupancy():
    cursor.execute("SELECT type, status FROM rooms")
    rows = cursor.fetchall()
    df = pd.DataFrame(rows)
    occupied = df[df["status"]=="booked"].groupby("type").size()
    total = df.groupby("type").size()
    occupancy_rate = (occupied / total * 100).fillna(0)
    return occupancy_rate.to_dict()

@app.get("/analytics/stay_duration")
def stay_duration():
    cursor.execute("SELECT check_in, check_out FROM bookings")
    rows = cursor.fetchall()
    df = pd.DataFrame(rows)
    df["duration"] = (pd.to_datetime(df["check_out"]) - pd.to_datetime(df["check_in"])).dt.days
    avg_duration = df["duration"].mean()
    return {"average_stay_days": float(avg_duration)}

@app.get("/analytics/top_customers")
def top_customers():
    cursor.execute("SELECT c.name, p.amount FROM customers c JOIN bookings b ON c.customer_id=b.customer_id JOIN payments p ON b.booking_id=p.booking_id")
    rows = cursor.fetchall()
    df = pd.DataFrame(rows)
    result = df.groupby("name")["amount"].sum().sort_values(ascending=False)
    return result.to_dict()

@app.get("/analytics/payment_methods")
def payment_methods():
    cursor.execute("SELECT method FROM payments")
    rows = cursor.fetchall()
    df = pd.DataFrame(rows)
    result = df["method"].value_counts(normalize=True) * 100
    return result.to_dict()


@app.get("/analytics/dashboard")
def dashboard():
    # Revenue
    cursor.execute("SELECT amount FROM payments")
    payments = cursor.fetchall()
    df_payments = pd.DataFrame(payments)
    total_revenue = df_payments["amount"].sum()

    # Occupancy
    cursor.execute("SELECT type, status FROM rooms")
    rooms = cursor.fetchall()
    df_rooms = pd.DataFrame(rooms)
    occupied = df_rooms[df_rooms["status"]=="booked"].groupby("type").size()
    total = df_rooms.groupby("type").size()
    occupancy_rate = (occupied / total * 100).fillna(0).to_dict()

    # Stay Duration
    cursor.execute("SELECT check_in, check_out FROM bookings")
    bookings = cursor.fetchall()
    df_bookings = pd.DataFrame(bookings)
    df_bookings["duration"] = (pd.to_datetime(df_bookings["check_out"]) - pd.to_datetime(df_bookings["check_in"])).dt.days
    avg_duration = df_bookings["duration"].mean()

    # Payment Methods
    cursor.execute("SELECT method FROM payments")
    methods = cursor.fetchall()
    df_methods = pd.DataFrame(methods)
    payment_distribution = (df_methods["method"].value_counts(normalize=True) * 100).to_dict()

    return {
        "total_revenue": float(total_revenue),
        "occupancy_rate": occupancy_rate,
        "average_stay_days": float(avg_duration),
        "payment_distribution": payment_distribution
    }


