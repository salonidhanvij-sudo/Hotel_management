document.addEventListener("DOMContentLoaded", function () {

    const roomType = document.getElementById("roomType");
    const priceFilter = document.getElementById("priceFilter");
    const guestFilter = document.getElementById("guestFilter");

    const resetFilters = document.getElementById("resetFilters");
    const roomCount = document.getElementById("roomCount");
    const noRooms = document.getElementById("noRooms");

    const filterButtons = document.querySelectorAll(".room-filter-btn");
    const roomItems = document.querySelectorAll(".room-item");

    function applyFilters() {

        const selectedType = roomType
            ? roomType.value
            : "all";

        const selectedPrice = priceFilter
            ? priceFilter.value
            : "all";

        const selectedGuests = guestFilter
            ? guestFilter.value
            : "all";

        let visibleCount = 0;

        roomItems.forEach(function (room) {

            const type = room.dataset.type;
            const price = Number(room.dataset.price || 0);
            const guests = Number(room.dataset.guests || 0);

            let typeMatch = true;
            let priceMatch = true;
            let guestMatch = true;

            // Room type filter
            if (selectedType !== "all") {
                typeMatch = type === selectedType;
            }

            // Price filter
            if (selectedPrice !== "all") {
                priceMatch = price <= Number(selectedPrice);
            }

            // Guest filter
            if (selectedGuests !== "all") {
                guestMatch = guests >= Number(selectedGuests);
            }

            const showRoom =
                typeMatch &&
                priceMatch &&
                guestMatch;

            if (showRoom) {
                room.classList.remove("hidden");
                visibleCount++;
            } else {
                room.classList.add("hidden");
            }
        });

        if (roomCount) {
            roomCount.textContent =
                `${visibleCount} room${visibleCount !== 1 ? "s" : ""} available`;
        }

        if (noRooms) {
            noRooms.classList.toggle(
                "show",
                visibleCount === 0
            );
        }
    }

    // Select filters
    if (roomType) {
        roomType.addEventListener("change", function () {

            filterButtons.forEach(function (button) {
                button.classList.remove("active");
            });

            applyFilters();
        });
    }

    if (priceFilter) {
        priceFilter.addEventListener(
            "change",
            applyFilters
        );
    }

    if (guestFilter) {
        guestFilter.addEventListener(
            "change",
            applyFilters
        );
    }

    // Category buttons
    filterButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            filterButtons.forEach(function (btn) {
                btn.classList.remove("active");
            });

            button.classList.add("active");

            const filter =
                button.dataset.filter;

            if (roomType) {
                roomType.value = filter;
            }

            applyFilters();
        });
    });

    // Reset
    if (resetFilters) {

        resetFilters.addEventListener("click", function () {

            if (roomType) {
                roomType.value = "all";
            }

            if (priceFilter) {
                priceFilter.value = "all";
            }

            if (guestFilter) {
                guestFilter.value = "all";
            }

            filterButtons.forEach(function (button) {

                button.classList.remove("active");

                if (button.dataset.filter === "all") {
                    button.classList.add("active");
                }
            });

            applyFilters();
        });
    }

    // Booking buttons
    const bookingButtons =
        document.querySelectorAll(".room-book-btn");

    bookingButtons.forEach(function (button) {

        button.addEventListener("click", function (event) {

            event.preventDefault();

            const room =
                button.dataset.room;

            if (!room) {
                window.location.href =
                    button.getAttribute("href");

                return;
            }

            window.location.href =
                `booking.html?room=${encodeURIComponent(room)}`;
        });
    });

    applyFilters();
});