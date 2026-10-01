/* =========================================
   HOME PAGE JAVASCRIPT
========================================= */

const quickBookingForm =
    document.getElementById("quickBookingForm");

const homeCheckIn =
    document.getElementById("homeCheckIn");

const homeCheckOut =
    document.getElementById("homeCheckOut");


/* =========================================
   SET MINIMUM DATES
========================================= */

if (homeCheckIn && homeCheckOut) {

    const today = new Date();

    const year = today.getFullYear();

    const month = String(
        today.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        today.getDate()
    ).padStart(2, "0");

    const todayString =
        `${year}-${month}-${day}`;


    homeCheckIn.min = todayString;

    homeCheckOut.min = todayString;


    homeCheckIn.addEventListener(
        "change",
        function () {

            homeCheckOut.min =
                homeCheckIn.value;

            if (
                homeCheckOut.value &&
                homeCheckOut.value <= homeCheckIn.value
            ) {

                homeCheckOut.value = "";

            }

        }
    );

}


/* =========================================
   QUICK BOOKING
========================================= */

if (quickBookingForm) {

    quickBookingForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const checkIn =
                homeCheckIn.value;

            const checkOut =
                homeCheckOut.value;


            if (!checkIn || !checkOut) {

                alert(
                    "Please select both check-in and check-out dates."
                );

                return;

            }


            if (checkOut <= checkIn) {

                alert(
                    "Check-out date must be after check-in date."
                );

                return;

            }


            /*
             * Redirect to booking page
             */

            const bookingUrl =
                `pages/booking.html?checkin=${encodeURIComponent(checkIn)}&checkout=${encodeURIComponent(checkOut)}`;


            window.location.href =
                bookingUrl;

        }
    );

}