from datetime import date
from typing import Literal, Optional

from pydantic import BaseModel, EmailStr, Field, model_validator


class BookingCreate(BaseModel):
    room: str = Field(description="Room slug, e.g. 'deluxe', 'executive'")
    check_in: date
    check_out: date
    adults: int = Field(2, ge=1, le=6)
    children: int = Field(0, ge=0, le=4)

    first_name: str = Field(min_length=1, max_length=60)
    last_name: str = Field(min_length=1, max_length=60)
    email: EmailStr
    phone: str = Field(min_length=7, max_length=25)
    requests: Optional[str] = Field(None, max_length=1000)

    payment_method: Literal["card", "upi", "netbanking"] = "card"
    # Optional: lets the website keep the same booking ID it already shows the guest.
    booking_ref: Optional[str] = Field(None, pattern=r"^GV\d{5}$")

    @model_validator(mode="after")
    def check_dates(self):
        if self.check_out <= self.check_in:
            raise ValueError("check_out must be after check_in")
        if self.check_in < date.today():
            raise ValueError("check_in cannot be in the past")
        return self