/* =========================================
   GRANDVISTA BOOKING PAGE
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =========================================
       GET HTML ELEMENTS
    ========================================= */

    const bookingForm =
        document.getElementById("bookingForm");

    const roomSelect =
        document.getElementById("room");

    const checkIn =
        document.getElementById("checkin");

    const checkOut =
        document.getElementById("checkout");

    const adults =
        document.getElementById("adults");

    const children =
        document.getElementById("children");


    /* =========================================
       MAIN BOOKING SUMMARY
    ========================================= */

    const summaryRoom =
        document.getElementById("summaryRoom");

    const summaryNights =
        document.getElementById("summaryNights");

    const roomPriceElement =
        document.getElementById("roomPrice");

    const taxPriceElement =
        document.getElementById("taxPrice");

    const totalPriceElement =
        document.getElementById("totalPrice");

    const summaryCheckin =
        document.getElementById("summaryCheckin");

    const summaryCheckout =
        document.getElementById("summaryCheckout");

    const summaryGuests =
        document.getElementById("summaryGuests");


    /* =========================================
       PAYMENT ELEMENTS
    ========================================= */

    const paymentSection =
        document.getElementById("paymentSection");

    const paymentRoom =
        document.getElementById("paymentRoom");

    const paymentCheckin =
        document.getElementById("paymentCheckin");

    const paymentCheckout =
        document.getElementById("paymentCheckout");

    const paymentGuests =
        document.getElementById("paymentGuests");

    const paymentAmount =
        document.getElementById("paymentAmount");

    const payButtonAmount =
        document.getElementById("payButtonAmount");

    const payNowButton =
        document.getElementById("payNowButton");


    /* =========================================
       SUCCESS MODAL
    ========================================= */

    const successModal =
        document.getElementById("successModal");

    const bookingIdElement =
        document.getElementById("bookingId");

    const closeModal =
        document.getElementById("closeModal");

    const doneButton =
        document.getElementById("doneButton");


    /* =========================================
       PAYMENT SUCCESS MODAL
    ========================================= */

    const paymentSuccessModal =
        document.getElementById("paymentSuccessModal");

    const demoBookingId =
        document.getElementById("demoBookingId");

    const successClose =
        document.getElementById("successClose");

    const successDone =
        document.getElementById("successDone");


    /* =========================================
       ROOM DATA
    ========================================= */

    const roomData = {

        "deluxe": {
            name: "Deluxe King Room",
            price: 5999
        },

        "deluxe-twin": {
            name: "Deluxe Twin Room",
            price: 6499
        },

        "executive": {
            name: "Executive Suite",
            price: 8999
        },

        "family": {
            name: "Family Suite",
            price: 9999
        },

        "premium": {
            name: "Premium Suite",
            price: 11999
        },

        "presidential": {
            name: "Presidential Suite",
            price: 14999
        }

    };


    /* =========================================
       CALCULATE NIGHTS
    ========================================= */

    function calculateNights() {

        if (!checkIn || !checkOut) {
            return 0;
        }

        if (!checkIn.value || !checkOut.value) {
            return 0;
        }

        const startDate =
            new Date(checkIn.value);

        const endDate =
            new Date(checkOut.value);

        const difference =
            endDate - startDate;

        const nights =
            Math.ceil(
                difference /
                (1000 * 60 * 60 * 24)
            );

        return nights > 0 ? nights : 0;
    }


    /* =========================================
       UPDATE PAYMENT SUMMARY
    ========================================= */

    function updatePaymentSummary() {

        const selectedRoom =
            roomData[
                roomSelect
                    ? roomSelect.value
                    : ""
            ];

        const nights =
            calculateNights();


        /* -------------------------------------
           NO VALID BOOKING YET
        ------------------------------------- */

        if (!selectedRoom || nights <= 0) {

            if (paymentRoom) {
                paymentRoom.textContent =
                    selectedRoom
                        ? selectedRoom.name
                        : "Select Room";
            }

            if (paymentCheckin) {
                paymentCheckin.textContent =
                    checkIn?.value || "—";
            }

            if (paymentCheckout) {
                paymentCheckout.textContent =
                    checkOut?.value || "—";
            }

            if (paymentGuests) {
                paymentGuests.textContent = "—";
            }

            if (paymentAmount) {
                paymentAmount.textContent = "₹0";
            }

            if (payButtonAmount) {
                payButtonAmount.textContent = "₹0";
            }

            return;
        }


        /* -------------------------------------
           CALCULATE PRICE
        ------------------------------------- */

        const roomTotal =
            selectedRoom.price * nights;

        const tax =
            roomTotal * 0.12;

        const total =
            roomTotal + tax;


        const formattedTotal =
            `₹${total.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })}`;


        /* -------------------------------------
           ROOM
        ------------------------------------- */

        if (paymentRoom) {
            paymentRoom.textContent =
                selectedRoom.name;
        }


        /* -------------------------------------
           DATES
        ------------------------------------- */

        if (paymentCheckin) {
            paymentCheckin.textContent =
                checkIn.value || "—";
        }

        if (paymentCheckout) {
            paymentCheckout.textContent =
                checkOut.value || "—";
        }


        /* -------------------------------------
           GUESTS
        ------------------------------------- */

        const adultCount =
            adults
                ? Number(adults.value || 0)
                : 0;

        const childCount =
            children
                ? Number(children.value || 0)
                : 0;

        const totalGuests =
            adultCount + childCount;


        if (paymentGuests) {

            paymentGuests.textContent =
                `${totalGuests} Guest${totalGuests !== 1 ? "s" : ""}`;
        }


        /* -------------------------------------
           PAYMENT TOTAL
        ------------------------------------- */

        if (paymentAmount) {
            paymentAmount.textContent =
                formattedTotal;
        }

        if (payButtonAmount) {
            payButtonAmount.textContent =
                formattedTotal;
        }
    }


    /* =========================================
       UPDATE MAIN BOOKING SUMMARY
    ========================================= */

    function calculateTotal() {

        const selectedRoom =
            roomData[
                roomSelect
                    ? roomSelect.value
                    : ""
            ];

        const nights =
            calculateNights();


        /* -------------------------------------
           ROOM / DATE NOT READY
        ------------------------------------- */

        if (!selectedRoom || nights <= 0) {

            if (summaryRoom) {
                summaryRoom.textContent =
                    selectedRoom
                        ? selectedRoom.name
                        : "Select a room";
            }

            if (summaryNights) {
                summaryNights.textContent = "0";
            }

            if (roomPriceElement) {
                roomPriceElement.textContent = "₹0";
            }

            if (taxPriceElement) {
                taxPriceElement.textContent = "₹0";
            }

            if (totalPriceElement) {
                totalPriceElement.textContent = "₹0";
            }

            if (summaryCheckin) {
                summaryCheckin.textContent =
                    checkIn?.value || "—";
            }

            if (summaryCheckout) {
                summaryCheckout.textContent =
                    checkOut?.value || "—";
            }

            updatePaymentSummary();

            return;
        }


        /* -------------------------------------
           CALCULATE TOTAL
        ------------------------------------- */

        const roomTotal =
            selectedRoom.price * nights;

        const tax =
            roomTotal * 0.12;

        const total =
            roomTotal + tax;


        /* -------------------------------------
           MAIN SUMMARY
        ------------------------------------- */

        if (summaryRoom) {
            summaryRoom.textContent =
                selectedRoom.name;
        }

        if (summaryNights) {
            summaryNights.textContent =
                nights;
        }

        if (roomPriceElement) {
            roomPriceElement.textContent =
                `₹${roomTotal.toLocaleString("en-IN")}`;
        }

        if (taxPriceElement) {
            taxPriceElement.textContent =
                `₹${tax.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                })}`;
        }

        if (totalPriceElement) {
            totalPriceElement.textContent =
                `₹${total.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                })}`;
        }


        /* -------------------------------------
           DATES
        ------------------------------------- */

        if (summaryCheckin) {
            summaryCheckin.textContent =
                checkIn.value || "—";
        }

        if (summaryCheckout) {
            summaryCheckout.textContent =
                checkOut.value || "—";
        }


        /* -------------------------------------
           GUESTS
        ------------------------------------- */

        const adultCount =
            adults
                ? Number(adults.value || 0)
                : 0;

        const childCount =
            children
                ? Number(children.value || 0)
                : 0;

        const totalGuests =
            adultCount + childCount;


        if (summaryGuests) {

            summaryGuests.textContent =
                `${totalGuests} Guest${totalGuests !== 1 ? "s" : ""}`;
        }


        /* -------------------------------------
           UPDATE PAYMENT
        ------------------------------------- */

        updatePaymentSummary();
    }


    /* =========================================
       SET MINIMUM DATES
    ========================================= */

    function setMinimumDates() {

        const today =
            new Date();

        const year =
            today.getFullYear();

        const month =
            String(
                today.getMonth() + 1
            ).padStart(2, "0");

        const day =
            String(
                today.getDate()
            ).padStart(2, "0");

        const todayString =
            `${year}-${month}-${day}`;


        if (checkIn) {
            checkIn.min =
                todayString;
        }

        if (checkOut) {
            checkOut.min =
                todayString;
        }
    }


    /* =========================================
       DATE EVENTS
    ========================================= */

    if (checkIn) {

        checkIn.addEventListener(
            "change",
            function () {

                if (checkOut) {

                    checkOut.min =
                        checkIn.value;

                    if (
                        checkOut.value &&
                        checkOut.value <= checkIn.value
                    ) {

                        checkOut.value = "";
                    }
                }

                calculateTotal();
            }
        );
    }


    if (checkOut) {

        checkOut.addEventListener(
            "change",
            calculateTotal
        );
    }


    /* =========================================
       ROOM CHANGE
    ========================================= */

    if (roomSelect) {

        roomSelect.addEventListener(
            "change",
            calculateTotal
        );
    }


    /* =========================================
       GUEST CHANGE
    ========================================= */

    if (adults) {

        adults.addEventListener(
            "change",
            calculateTotal
        );
    }


    if (children) {

        children.addEventListener(
            "change",
            calculateTotal
        );
    }


    /* =========================================
       SAVE BOOKING
    ========================================= */

    function saveBookingToDashboard(booking) {

        let bookings =
            JSON.parse(
                localStorage.getItem(
                    "grandvista_bookings"
                )
            ) || [];


        bookings.push(booking);


        localStorage.setItem(
            "grandvista_bookings",
            JSON.stringify(bookings)
        );
    }


    /* =========================================
       SAVE GUEST
    ========================================= */

    function saveGuestToDashboard(
        guestName,
        email,
        phone
    ) {

        let guests =
            JSON.parse(
                localStorage.getItem(
                    "grandvista_guests"
                )
            ) || [];


        const existingGuest =
            guests.find(
                guest =>
                    guest.email === email
            );


        if (existingGuest) {

            existingGuest.bookings =
                Number(
                    existingGuest.bookings || 0
                ) + 1;

        } else {

            guests.push({

                id:
                    Date.now(),

                name:
                    guestName,

                email:
                    email,

                phone:
                    phone,

                bookings:
                    1
            });
        }


        localStorage.setItem(
            "grandvista_guests",
            JSON.stringify(guests)
        );
    }


    /* =========================================
       UPDATE ROOM STATUS
    ========================================= */

    function updateRoomStatus(roomName) {

        let rooms =
            JSON.parse(
                localStorage.getItem(
                    "grandvista_rooms"
                )
            ) || [];


        const room =
            rooms.find(
                item =>
                    String(item.name || "")
                        .trim()
                        .toLowerCase() ===
                    String(roomName || "")
                        .trim()
                        .toLowerCase()
            );


        if (room) {

            room.status =
                "Occupied";


            localStorage.setItem(
                "grandvista_rooms",
                JSON.stringify(rooms)
            );
        }
    }


    /* =========================================
       GENERATE BOOKING ID
    ========================================= */

    function generateBookingId() {

        const randomNumber =
            Math.floor(
                10000 +
                Math.random() * 90000
            );

        return `GV${randomNumber}`;
    }


    /* =========================================
       SHOW SUCCESS MODAL
    ========================================= */

    function showSuccessModal(bookingId) {

        if (bookingIdElement) {

            bookingIdElement.textContent =
                bookingId;
        }


        if (successModal) {

            successModal.classList.add(
                "active"
            );

            successModal.style.display =
                "flex";

        } else {

            alert(
                `Booking confirmed!\n\nBooking ID: ${bookingId}`
            );
        }
    }


    /* =========================================
       CLOSE SUCCESS MODAL
    ========================================= */

    function hideSuccessModal() {

        if (successModal) {

            successModal.classList.remove(
                "active"
            );

            successModal.style.display =
                "none";
        }
    }


    if (closeModal) {

        closeModal.addEventListener(
            "click",
            hideSuccessModal
        );
    }


    if (doneButton) {

        doneButton.addEventListener(
            "click",
            hideSuccessModal
        );
    }


    /* =========================================
       SHOW PAYMENT SECTION
    ========================================= */

    function showPaymentSection() {

        updatePaymentSummary();


        if (paymentSection) {

            paymentSection.style.display =
                "block";


            paymentSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    }


    /* =========================================
       BOOKING FORM SUBMIT
    ========================================= */

    if (bookingForm) {

        bookingForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                /* =========================
                   VALIDATE DATES
                ========================= */

                const nights =
                    calculateNights();


                if (nights <= 0) {

                    alert(
                        "Please select valid check-in and check-out dates."
                    );

                    return;
                }


                /* =========================
                   GET SELECTED ROOM
                ========================= */

                const selectedRoom =
                    roomData[
                        roomSelect
                            ? roomSelect.value
                            : ""
                    ];


                if (!selectedRoom) {

                    alert(
                        "Please select a room."
                    );

                    return;
                }


                /* =========================
                   GET GUEST DETAILS
                ========================= */

                const firstName =
                    document.getElementById(
                        "firstName"
                    )?.value.trim() || "";


                const lastName =
                    document.getElementById(
                        "lastName"
                    )?.value.trim() || "";


                const email =
                    document.getElementById(
                        "email"
                    )?.value.trim() || "";


                const phone =
                    document.getElementById(
                        "phone"
                    )?.value.trim() || "";


                const requests =
                    document.getElementById(
                        "requests"
                    )?.value.trim() || "";


                const guestName =
                    `${firstName} ${lastName}`.trim();


                /* =========================
                   GUEST COUNT
                ========================= */

                const adultCount =
                    adults
                        ? Number(adults.value || 0)
                        : 0;


                const childCount =
                    children
                        ? Number(children.value || 0)
                        : 0;


                const totalGuests =
                    adultCount + childCount;


                /* =========================
                   PRICE
                ========================= */

                const roomTotal =
                    selectedRoom.price * nights;


                const tax =
                    roomTotal * 0.12;


                const total =
                    roomTotal + tax;


                /* =========================
                   SHOW PAYMENT
                ========================= */

                showPaymentSection();


                /* =========================
                   STORE TEMPORARY BOOKING
                ========================= */

                window.currentBooking = {

                    guest:
                        guestName,

                    email:
                        email,

                    phone:
                        phone,

                    room:
                        selectedRoom.name,

                    checkIn:
                        checkIn.value,

                    checkOut:
                        checkOut.value,

                    adults:
                        adultCount,

                    children:
                        childCount,

                    guests:
                        totalGuests,

                    nights:
                        nights,

                    roomPrice:
                        selectedRoom.price,

                    tax:
                        Math.round(tax),

                    amount:
                        Math.round(total),

                    requests:
                        requests
                };
            }
        );
    }


    /* =========================================
       PAYMENT METHOD SWITCHING
    ========================================= */

    const paymentMethods =
        document.querySelectorAll(
            ".payment-method"
        );

    const paymentContents =
        document.querySelectorAll(
            ".payment-method-content"
        );


    paymentMethods.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                const method =
                    button.dataset.method;


                paymentMethods.forEach(
                    function (item) {

                        item.classList.remove(
                            "active"
                        );
                    }
                );


                button.classList.add(
                    "active"
                );


                paymentContents.forEach(
                    function (content) {

                        content.classList.remove(
                            "active"
                        );
                    }
                );


                const selectedContent =
                    document.getElementById(
                        method + "Payment"
                    );


                if (selectedContent) {

                    selectedContent.classList.add(
                        "active"
                    );
                }
            }
        );
    });


    /* =========================================
       CARD NUMBER FORMATTING
    ========================================= */

    const cardNumber =
        document.getElementById("cardNumber");


    if (cardNumber) {

        cardNumber.addEventListener(
            "input",
            function () {

                let value =
                    cardNumber.value
                        .replace(/\D/g, "");

                value =
                    value.substring(0, 16);

                value =
                    value
                        .replace(/(.{4})/g, "$1 ")
                        .trim();

                cardNumber.value =
                    value;
            }
        );
    }


    /* =========================================
       CARD EXPIRY FORMATTING
    ========================================= */

    const cardExpiry =
        document.getElementById("cardExpiry");


    if (cardExpiry) {

        cardExpiry.addEventListener(
            "input",
            function () {

                let value =
                    cardExpiry.value
                        .replace(/\D/g, "");

                value =
                    value.substring(0, 4);


                if (value.length >= 3) {

                    value =
                        value.substring(0, 2)
                        + "/"
                        + value.substring(2);
                }


                cardExpiry.value =
                    value;
            }
        );
    }


    /* =========================================
       CVV FORMATTING
    ========================================= */

    const cardCvv =
        document.getElementById("cardCvv");


    if (cardCvv) {

        cardCvv.addEventListener(
            "input",
            function () {

                cardCvv.value =
                    cardCvv.value
                        .replace(/\D/g, "")
                        .substring(0, 3);
            }
        );
    }


    /* =========================================
       VALIDATE DEMO PAYMENT
    ========================================= */

    function validateDemoPayment() {

        const activeMethod =
            document.querySelector(
                ".payment-method.active"
            );


        if (!activeMethod) {

            alert(
                "Please select a payment method."
            );

            return false;
        }


        const method =
            activeMethod.dataset.method;


        /* =========================
           CARD
        ========================= */

        if (method === "card") {

            const name =
                document.getElementById(
                    "cardName"
                )?.value.trim() || "";


            const number =
                document.getElementById(
                    "cardNumber"
                )?.value
                    .replace(/\s/g, "") || "";


            const expiry =
                document.getElementById(
                    "cardExpiry"
                )?.value.trim() || "";


            const cvv =
                document.getElementById(
                    "cardCvv"
                )?.value.trim() || "";


            if (!name) {

                alert(
                    "Please enter the cardholder name."
                );

                return false;
            }


            if (number.length !== 16) {

                alert(
                    "Please enter a valid 16-digit demo card number."
                );

                return false;
            }


            if (!/^\d{2}\/\d{2}$/.test(expiry)) {

                alert(
                    "Please enter expiry date in MM/YY format."
                );

                return false;
            }


            if (cvv.length !== 3) {

                alert(
                    "Please enter a valid 3-digit demo CVV."
                );

                return false;
            }
        }


        /* =========================
           UPI
        ========================= */

        if (method === "upi") {

            const upiId =
                document.getElementById(
                    "upiId"
                )?.value.trim() || "";


            if (
                !upiId ||
                !upiId.includes("@")
            ) {

                alert(
                    "Please enter a valid demo UPI ID."
                );

                return false;
            }
        }


        /* =========================
           NET BANKING
        ========================= */

        if (method === "netbanking") {

            const bank =
                document.getElementById(
                    "bankSelect"
                )?.value || "";


            if (!bank) {

                alert(
                    "Please select a bank."
                );

                return false;
            }
        }


        return true;
    }


    /* =========================================
       PAY NOW
    ========================================= */

    if (payNowButton) {

        payNowButton.addEventListener(
            "click",
            function () {

                if (!validateDemoPayment()) {
                    return;
                }


                const originalText =
                    payNowButton.innerHTML;


                payNowButton.disabled =
                    true;


                payNowButton.innerHTML =
                    "<span>Processing Payment...</span>";


                setTimeout(
                    function () {

                        /* =====================
                           GENERATE BOOKING ID
                        ===================== */

                        const bookingId =
                            generateBookingId();


                        /* =====================
                           SAVE BOOKING
                        ===================== */

                        if (window.currentBooking) {

                            window.currentBooking.id =
                                bookingId;

                            window.currentBooking.status =
                                "Confirmed";

                            window.currentBooking.createdAt =
                                new Date().toISOString();


                            saveBookingToDashboard(
                                window.currentBooking
                            );


                            saveGuestToDashboard(
                                window.currentBooking.guest,
                                window.currentBooking.email,
                                window.currentBooking.phone
                            );


                            updateRoomStatus(
                                window.currentBooking.room
                            );
                        }


                        /* =====================
                           SHOW SUCCESS
                        ===================== */

                        if (demoBookingId) {

                            demoBookingId.textContent =
                                bookingId;
                        }


                        if (paymentSuccessModal) {

                            paymentSuccessModal.classList.add(
                                "active"
                            );

                        } else {

                            showSuccessModal(
                                bookingId
                            );
                        }


                        /* =====================
                           RESTORE BUTTON
                        ===================== */

                        payNowButton.disabled =
                            false;


                        payNowButton.innerHTML =
                            `<span>Pay</span>
                             <strong>${paymentAmount
                                ? paymentAmount.textContent
                                : "₹0"}</strong>`;

                    },
                    1800
                );
            }
        );
    }


    /* =========================================
       CLOSE PAYMENT SUCCESS MODAL
    ========================================= */

    function closePaymentSuccess() {

        if (paymentSuccessModal) {

            paymentSuccessModal.classList.remove(
                "active"
            );
        }
    }


    if (successClose) {

        successClose.addEventListener(
            "click",
            closePaymentSuccess
        );
    }


    if (successDone) {

    successDone.addEventListener(
        "click",
        function () {

            closePaymentSuccess();

            window.location.reload();

        }
    );
}


    /* =========================================
       READ ROOM / DATES FROM URL
    ========================================= */

    const urlParams =
        new URLSearchParams(
            window.location.search
        );


    const roomFromURL =
        urlParams.get("room");


    if (
        roomFromURL &&
        roomSelect &&
        roomData[roomFromURL]
    ) {

        roomSelect.value =
            roomFromURL;
    }


    const checkInFromURL =
        urlParams.get("checkin");

    const checkOutFromURL =
        urlParams.get("checkout");


    if (
        checkInFromURL &&
        checkIn
    ) {

        checkIn.value =
            checkInFromURL;
    }


    if (
        checkOutFromURL &&
        checkOut
    ) {

        checkOut.value =
            checkOutFromURL;
    }


    /* =========================================
       INITIALIZE
    ========================================= */

    setMinimumDates();

    calculateTotal();

});

