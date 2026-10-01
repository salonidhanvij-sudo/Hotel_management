/* =========================================
   HOME PAGE JAVASCRIPT
========================================= */

const quickBookingForm = document.getElementById("quickBookingForm");
const homeCheckIn = document.getElementById("homeCheckIn");
const homeCheckOut = document.getElementById("homeCheckOut");
const homeGuests = document.getElementById("homeGuests");


/* =========================================
   SET MINIMUM DATES
========================================= */

if (homeCheckIn && homeCheckOut) {

    const today = new Date();

    const todayString =
        today.getFullYear() + "-" +
        String(today.getMonth() + 1).padStart(2, "0") + "-" +
        String(today.getDate()).padStart(2, "0");

    homeCheckIn.min = todayString;
    homeCheckOut.min = todayString;

    homeCheckIn.addEventListener("change", function () {

        homeCheckOut.min = homeCheckIn.value || todayString;

        if (homeCheckOut.value && homeCheckOut.value <= homeCheckIn.value) {
            homeCheckOut.value = "";
        }

    });

}


/* =========================================
   QUICK BOOKING -> BOOKING PAGE
========================================= */

if (quickBookingForm) {

    quickBookingForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const checkIn = homeCheckIn.value;
        const checkOut = homeCheckOut.value;
        const guests = homeGuests ? homeGuests.value : "2";

        if (!checkIn || !checkOut) {
            alert("Please select both check-in and check-out dates.");
            return;
        }

        if (checkOut <= checkIn) {
            alert("Check-out date must be after check-in date.");
            return;
        }

        window.location.href =
            "pages/booking.html" +
            "?checkin=" + encodeURIComponent(checkIn) +
            "&checkout=" + encodeURIComponent(checkOut) +
            "&guests=" + encodeURIComponent(guests);

    });

}