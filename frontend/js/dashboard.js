/* =========================================
   GRANDVISTA HOTEL
   ADMIN DASHBOARD
   STEP 10
========================================= */


/* =========================================
   STORAGE KEYS
========================================= */

const STORAGE_KEYS = {

    rooms: "grandvista_rooms",

    guests: "grandvista_guests",

    bookings: "grandvista_bookings"

};


/* =========================================
   DEFAULT DATA
========================================= */

const defaultRooms = [

    {
        id: 1,
        number: "101",
        name: "Deluxe King",
        category: "Deluxe",
        price: 5999,
        status: "Available"
    },

    {
        id: 2,
        number: "102",
        name: "Deluxe Twin",
        category: "Deluxe",
        price: 6499,
        status: "Occupied"
    },

    {
        id: 3,
        number: "201",
        name: "Executive Suite",
        category: "Suite",
        price: 8999,
        status: "Occupied"
    },

    {
        id: 4,
        number: "202",
        name: "Family Suite",
        category: "Family",
        price: 9999,
        status: "Available"
    },

    {
        id: 5,
        number: "301",
        name: "Premium Suite",
        category: "Premium",
        price: 11999,
        status: "Maintenance"
    },

    {
        id: 6,
        number: "302",
        name: "Presidential",
        category: "Premium",
        price: 14999,
        status: "Available"
    }

];


const defaultGuests = [

    {
        id: 1,
        name: "Aditi Rao",
        email: "aditi@example.com",
        phone: "9876543210",
        bookings: 3
    },

    {
        id: 2,
        name: "Rahul Verma",
        email: "rahul@example.com",
        phone: "9876543211",
        bookings: 2
    },

    {
        id: 3,
        name: "Sneha Patel",
        email: "sneha@example.com",
        phone: "9876543212",
        bookings: 4
    }

];


const defaultBookings = [

    {
        id: "GV10245",
        guest: "Aditi Rao",
        room: "Deluxe King",
        checkIn: "2026-09-02",
        checkOut: "2026-09-05",
        amount: 17997,
        status: "Confirmed"
    },

    {
        id: "GV10246",
        guest: "Rahul Verma",
        room: "Executive Suite",
        checkIn: "2026-09-03",
        checkOut: "2026-09-06",
        amount: 26997,
        status: "Pending"
    },

    {
        id: "GV10247",
        guest: "Sneha Patel",
        room: "Premium Suite",
        checkIn: "2026-09-04",
        checkOut: "2026-09-08",
        amount: 47996,
        status: "Confirmed"
    },

    {
        id: "GV10248",
        guest: "Vikram Kumar",
        room: "Family Suite",
        checkIn: "2026-09-05",
        checkOut: "2026-09-07",
        amount: 19998,
        status: "Cancelled"
    }

];


/* =========================================
   LOCAL STORAGE HELPERS
========================================= */

function getData(key, fallback) {

    const saved =
        localStorage.getItem(key);

    if (!saved) {

        localStorage.setItem(
            key,
            JSON.stringify(fallback)
        );

        return fallback;

    }


    try {

        return JSON.parse(saved);

    } catch (error) {

        localStorage.setItem(
            key,
            JSON.stringify(fallback)
        );

        return fallback;

    }

}


function saveData(key, data) {

    localStorage.setItem(
        key,
        JSON.stringify(data)
    );

}


let rooms = getData(STORAGE_KEYS.rooms, []);
let guests = getData(STORAGE_KEYS.guests, []);
let bookings = getData(STORAGE_KEYS.bookings, []);

if (!Array.isArray(rooms) || rooms.length === 0) {
    rooms = [...defaultRooms];
    saveData(STORAGE_KEYS.rooms, rooms);
}

if (!Array.isArray(guests) || guests.length === 0) {
    guests = [...defaultGuests];
    saveData(STORAGE_KEYS.guests, guests);
}

if (!Array.isArray(bookings) || bookings.length === 0) {
    bookings = [...defaultBookings];
    saveData(STORAGE_KEYS.bookings, bookings);
}

/* =========================================
   SYNC DATA FROM CUSTOMER BOOKING
========================================= */

function syncDashboardData() {

    rooms =
        getData(
            STORAGE_KEYS.rooms,
            defaultRooms
        );

    guests =
        getData(
            STORAGE_KEYS.guests,
            defaultGuests
        );

    bookings =
        getData(
            STORAGE_KEYS.bookings,
            defaultBookings
        );

}


function refreshDashboard() {
    renderRooms();
    renderGuests();
    renderBookings();
    updateDashboardStats();

    if (typeof createRevenueChart === "function") {
        createRevenueChart();
    }
}
/* =========================================
   ELEMENTS
========================================= */

const sidebarLinks =
    document.querySelectorAll(
        ".sidebar-link"
    );

const dashboardSections =
    document.querySelectorAll(
        ".dashboard-section"
    );

const pageTitle =
    document.getElementById(
        "pageTitle"
    );

const sidebar =
    document.getElementById(
        "sidebar"
    );

const mobileMenuBtn =
    document.getElementById(
        "mobileMenuBtn"
    );


/* =========================================
   SECTION TITLES
========================================= */

const sectionTitles = {

    dashboard: "Dashboard",

    bookings: "Booking Management",

    rooms: "Room Management",

    guests: "Guest Management",

    revenue: "Revenue",

    services: "Services & Amenities",

    settings: "Settings"

};


/* =========================================
   NAVIGATION
========================================= */

sidebarLinks.forEach(
    function (link) {

        link.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                const section =
                    link.dataset.section;

                showSection(section);

                sidebar.classList.remove(
                    "mobile-open"
                );

            }
        );

    }
);


function showSection(sectionName) {

    sidebarLinks.forEach(
        function (link) {

            link.classList.toggle(
                "active",
                link.dataset.section ===
                sectionName
            );

        }
    );


    dashboardSections.forEach(
        function (section) {

            section.classList.remove(
                "active-section"
            );

        }
    );


    const target =
        document.getElementById(
            `${sectionName}Section`
        );


    if (target) {

        target.classList.add(
            "active-section"
        );

    }


    if (pageTitle) {

        pageTitle.textContent =
            sectionTitles[sectionName] ||
            "Dashboard";

    }


    if (sectionName === "rooms") {

        renderRooms();

    }


    if (sectionName === "guests") {

        renderGuests();

    }


    if (sectionName === "bookings") {

        renderBookings();

    }


    if (sectionName === "dashboard") {

        updateDashboardStats();

    }


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


/* =========================================
   MOBILE SIDEBAR
========================================= */

if (mobileMenuBtn) {

    mobileMenuBtn.addEventListener(
        "click",
        function () {

            sidebar.classList.toggle(
                "mobile-open"
            );

        }
    );

}


/* =========================================
   CURRENT DATE
========================================= */

const currentDate =
    document.getElementById(
        "currentDate"
    );


if (currentDate) {

    currentDate.textContent =
        new Date().toLocaleDateString(
            "en-IN",
            {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );

}


/* =========================================
   MODAL
========================================= */

const modalOverlay =
    document.getElementById(
        "modalOverlay"
    );

const modalTitle =
    document.getElementById(
        "modalTitle"
    );

const modalDescription =
    document.getElementById(
        "modalDescription"
    );

const modalForm =
    document.getElementById(
        "modalForm"
    );

const modalFormContent =
    document.getElementById(
        "modalFormContent"
    );

const modalClose =
    document.getElementById(
        "modalClose"
    );

const modalCancel =
    document.getElementById(
        "modalCancel"
    );


let currentModalType = null;

let editingId = null;


function openModal(
    type,
    data = null
) {

    currentModalType = type;

    editingId =
        data
            ? data.id
            : null;


    if (type === "booking") {

        modalTitle.textContent =
            data
                ? "Edit Booking"
                : "New Booking";

        modalDescription.textContent =
            "Enter guest and reservation details.";

        createBookingForm(data);

    }


    else if (type === "room") {

        modalTitle.textContent =
            data
                ? "Edit Room"
                : "Add New Room";

        modalDescription.textContent =
            "Enter room information.";

        createRoomForm(data);

    }


    else if (type === "guest") {

        modalTitle.textContent =
            data
                ? "Edit Guest"
                : "Add New Guest";

        modalDescription.textContent =
            "Enter guest information.";

        createGuestForm(data);

    }


    modalOverlay.classList.add(
        "active"
    );

    document.body.style.overflow =
        "hidden";

}


function closeModal() {

    modalOverlay.classList.remove(
        "active"
    );

    document.body.style.overflow =
        "";

    currentModalType = null;

    editingId = null;

}


modalClose.addEventListener(
    "click",
    closeModal
);


modalCancel.addEventListener(
    "click",
    closeModal
);


modalOverlay.addEventListener(
    "click",
    function (event) {

        if (
            event.target ===
            modalOverlay
        ) {

            closeModal();

        }

    }
);


/* =========================================
   FORM FIELD
========================================= */

function field(
    label,
    name,
    type = "text",
    value = "",
    full = false
) {

    return `
        <div class="form-group ${full ? "full" : ""}">

            <label for="${name}">
                ${label}
            </label>

            <input
                type="${type}"
                id="${name}"
                name="${name}"
                value="${value}"
                required
            >

        </div>
    `;

}


function selectField(
    label,
    name,
    options,
    selected = "",
    full = false
) {

    return `
        <div class="form-group ${full ? "full" : ""}">

            <label for="${name}">
                ${label}
            </label>

            <select
                id="${name}"
                name="${name}"
                required
            >

                ${options.map(
                    function (option) {

                        return `
                            <option
                                value="${option}"
                                ${option === selected
                                    ? "selected"
                                    : ""}
                            >
                                ${option}
                            </option>
                        `;

                    }
                ).join("")}

            </select>

        </div>
    `;

}


/* =========================================
   BOOKING FORM
========================================= */

function createBookingForm(data) {

    const guestOptions =
        guests.length
            ? guests.map(
                guest => guest.name
            )
            : ["No guests available"];


    const roomOptions =
        rooms
            .filter(
                room =>
                    room.status !==
                    "Maintenance"
            )
            .map(
                room =>
                    room.name
            );


    modalFormContent.innerHTML = `

        ${selectField(
            "Guest",
            "bookingGuest",
            guestOptions,
            data
                ? data.guest
                : ""
        )}

        ${selectField(
            "Room",
            "bookingRoom",
            roomOptions,
            data
                ? data.room
                : ""
        )}

        ${field(
            "Check-in",
            "bookingCheckIn",
            "date",
            data
                ? data.checkIn
                : ""
        )}

        ${field(
            "Check-out",
            "bookingCheckOut",
            "date",
            data
                ? data.checkOut
                : ""
        )}

        ${field(
            "Amount (₹)",
            "bookingAmount",
            "number",
            data
                ? data.amount
                : ""
        )}

        ${selectField(
            "Status",
            "bookingStatusForm",
            [
                "Confirmed",
                "Pending",
                "Cancelled"
            ],
            data
                ? data.status
                : "Confirmed"
        )}

    `;

}


/* =========================================
   ROOM FORM
========================================= */

function createRoomForm(data) {

    modalFormContent.innerHTML = `

        ${field(
            "Room Number",
            "roomNumber",
            "text",
            data
                ? data.number
                : ""
        )}

        ${field(
            "Room Name",
            "roomName",
            "text",
            data
                ? data.name
                : ""
        )}

        ${selectField(
            "Category",
            "roomCategory",
            [
                "Deluxe",
                "Suite",
                "Family",
                "Premium"
            ],
            data
                ? data.category
                : "Deluxe"
        )}

        ${field(
            "Price per Night (₹)",
            "roomPrice",
            "number",
            data
                ? data.price
                : ""
        )}

        ${selectField(
            "Status",
            "roomStatus",
            [
                "Available",
                "Occupied",
                "Maintenance"
            ],
            data
                ? data.status
                : "Available"
        )}

    `;

}


/* =========================================
   GUEST FORM
========================================= */

function createGuestForm(data) {

    modalFormContent.innerHTML = `

        ${field(
            "Full Name",
            "guestName",
            "text",
            data
                ? data.name
                : "",
            true
        )}

        ${field(
            "Email",
            "guestEmail",
            "email",
            data
                ? data.email
                : ""
        )}

        ${field(
            "Phone",
            "guestPhone",
            "tel",
            data
                ? data.phone
                : ""
        )}

    `;

}


/* =========================================
   FORM SUBMIT
========================================= */

modalForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        if (
            currentModalType ===
            "room"
        ) {

            saveRoom();

        }


        else if (
            currentModalType ===
            "guest"
        ) {

            saveGuest();

        }


        else if (
            currentModalType ===
            "booking"
        ) {

            saveBooking();

        }

    }
);


/* =========================================
   SAVE ROOM
========================================= */

function saveRoom() {

    const room = {

        id:
            editingId ||
            Date.now(),

        number:
            document.getElementById(
                "roomNumber"
            ).value.trim(),

        name:
            document.getElementById(
                "roomName"
            ).value.trim(),

        category:
            document.getElementById(
                "roomCategory"
            ).value,

        price:
            Number(
                document.getElementById(
                    "roomPrice"
                ).value
            ),

        status:
            document.getElementById(
                "roomStatus"
            ).value

    };


    if (editingId) {

        rooms =
            rooms.map(
                function (item) {

                    return item.id ===
                        editingId
                        ? room
                        : item;

                }
            );

        showToast(
            "Room updated successfully."
        );

    } else {

        rooms.push(room);

        showToast(
            "New room added successfully."
        );

    }


    saveData(
        STORAGE_KEYS.rooms,
        rooms
    );


    closeModal();

    renderRooms();

    updateDashboardStats();

}


/* =========================================
   SAVE GUEST
========================================= */

function saveGuest() {

    const guest = {

        id:
            editingId ||
            Date.now(),

        name:
            document.getElementById(
                "guestName"
            ).value.trim(),

        email:
            document.getElementById(
                "guestEmail"
            ).value.trim(),

        phone:
            document.getElementById(
                "guestPhone"
            ).value.trim(),

        bookings:
            editingId
                ? (
                    guests.find(
                        guest =>
                            guest.id ===
                            editingId
                    )?.bookings || 0
                )
                : 0

    };


    if (editingId) {

        guests =
            guests.map(
                function (item) {

                    return item.id ===
                        editingId
                        ? guest
                        : item;

                }
            );

        showToast(
            "Guest updated successfully."
        );

    } else {

        guests.push(guest);

        showToast(
            "Guest added successfully."
        );

    }


    saveData(
        STORAGE_KEYS.guests,
        guests
    );


    closeModal();

    renderGuests();

    updateDashboardStats();

}


function saveBooking() {
    const guest =
        document.getElementById("bookingGuest").value;

    const room =
        document.getElementById("bookingRoom").value;

    const checkIn =
        document.getElementById("bookingCheckIn").value;

    const checkOut =
        document.getElementById("bookingCheckOut").value;

    const amount =
        Number(
            document.getElementById("bookingAmount").value
        );

    const status =
        document.getElementById("bookingStatusForm").value;

    if (!guest || !room || !checkIn || !checkOut) {
        alert("Please fill all booking details.");
        return;
    }

    if (checkOut <= checkIn) {
        alert("Check-out must be after check-in.");
        return;
    }

    if (amount <= 0) {
        alert("Please enter a valid amount.");
        return;
    }

    const booking = {
        id: editingId || generateBookingId(),
        guest: guest,
        room: room,
        checkIn: checkIn,
        checkOut: checkOut,
        amount: amount,
        status: status
    };

    if (editingId) {

        bookings = bookings.map(function (item) {
            return item.id === editingId
                ? booking
                : item;
        });

        showToast("Booking updated successfully.");

    } else {

        bookings.push(booking);

        showToast("Booking created successfully.");
    }

    saveData(
        STORAGE_KEYS.bookings,
        bookings
    );

    closeModal();

    renderBookings();

    updateDashboardStats();
}


function generateBookingId() {
    let id;

    do {
        id = "GV" + Math.floor(10000 + Math.random() * 90000);
    } while (bookings.some(booking => booking.id === id));

    return id;
}


/* =========================================
   RENDER ROOMS
========================================= */

function renderRooms() {

    const section =
        document.getElementById(
            "roomsSection"
        );


    if (!section) {

        return;

    }


    const grid =
        section.querySelector(
            ".room-status-grid"
        );


    if (!grid) {

        return;

    }


    grid.innerHTML = "";


    if (rooms.length === 0) {

        grid.innerHTML = `

            <div class="empty-state">

                <div class="empty-state-icon">
                    🛏
                </div>

                <h3>
                    No rooms found
                </h3>

                <p>
                    Add your first hotel room.
                </p>

            </div>

        `;

        return;

    }


    rooms.forEach(
        function (room) {

            const statusClass =
                room.status
                    .toLowerCase()
                    .replace(
                        " ",
                        "-"
                    );


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                `room-status-card ${statusClass}-room`;


            card.innerHTML = `

                <span class="room-number">
                    ${room.number}
                </span>

                <strong>
                    ${room.name}
                </strong>

                <span class="room-status-text">
                    ${room.status}
                </span>

                <div class="room-card-actions">

                    <button
                        class="table-action edit-action"
                        data-edit-room="${room.id}"
                    >
                        ✎
                    </button>

                    <button
                        class="table-action delete-action"
                        data-delete-room="${room.id}"
                    >
                        ×
                    </button>

                </div>

            `;


            grid.appendChild(card);

        }
    );


    addRoomActionListeners();

}


/* =========================================
   ROOM ACTIONS
========================================= */

function addRoomActionListeners() {

    document
        .querySelectorAll(
            "[data-edit-room]"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const id =
                            Number(
                                button.dataset
                                    .editRoom
                            );

                        const room =
                            rooms.find(
                                item =>
                                    item.id ===
                                    id
                            );

                        if (room) {

                            openModal(
                                "room",
                                room
                            );

                        }

                    }
                );

            }
        );


    document
        .querySelectorAll(
            "[data-delete-room]"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const id =
                            Number(
                                button.dataset
                                    .deleteRoom
                            );


                        if (
                            confirm(
                                "Are you sure you want to delete this room?"
                            )
                        ) {

                            rooms =
                                rooms.filter(
                                    room =>
                                        room.id !==
                                        id
                                );


                            saveData(
                                STORAGE_KEYS.rooms,
                                rooms
                            );


                            renderRooms();

                            updateDashboardStats();

                            showToast(
                                "Room deleted."
                            );

                        }

                    }
                );

            }
        );

}


/* =========================================
   RENDER GUESTS
========================================= */

function renderGuests() {

    const section =
        document.getElementById(
            "guestsSection"
        );


    const list =
        section?.querySelector(
            ".guest-list"
        );


    if (!list) {

        return;

    }


    list.innerHTML = "";


    if (guests.length === 0) {

        list.innerHTML = `

            <div class="empty-state">

                <div class="empty-state-icon">
                    ♙
                </div>

                <h3>
                    No guests found
                </h3>

                <p>
                    Add your first guest.
                </p>

            </div>

        `;

        return;

    }


    guests.forEach(
        function (guest) {

            const initials =
                guest.name
                    .split(" ")
                    .map(
                        word =>
                            word[0]
                    )
                    .join("")
                    .substring(0, 2)
                    .toUpperCase();


            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "guest-row";


            row.innerHTML = `

                <div class="guest-avatar large">
                    ${initials}
                </div>

                <div class="guest-details">

                    <strong>
                        ${guest.name}
                    </strong>

                    <span>
                        ${guest.email}
                    </span>

                </div>

                <span>
                    ${guest.bookings} Bookings
                </span>

                <div class="table-actions">

                    <button
                        class="table-action edit-action"
                        data-edit-guest="${guest.id}"
                    >
                        ✎
                    </button>

                    <button
                        class="table-action delete-action"
                        data-delete-guest="${guest.id}"
                    >
                        ×
                    </button>

                </div>

            `;


            list.appendChild(row);

        }
    );


    addGuestActionListeners();

}


/* =========================================
   GUEST ACTIONS
========================================= */

function addGuestActionListeners() {

    document
        .querySelectorAll(
            "[data-edit-guest]"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const id =
                            Number(
                                button.dataset
                                    .editGuest
                            );


                        const guest =
                            guests.find(
                                item =>
                                    item.id ===
                                    id
                            );


                        if (guest) {

                            openModal(
                                "guest",
                                guest
                            );

                        }

                    }
                );

            }
        );


    document
        .querySelectorAll(
            "[data-delete-guest]"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const id =
                            Number(
                                button.dataset
                                    .deleteGuest
                            );


                        if (
                            confirm(
                                "Are you sure you want to delete this guest?"
                            )
                        ) {

                            guests =
                                guests.filter(
                                    guest =>
                                        guest.id !==
                                        id
                                );


                            saveData(
                                STORAGE_KEYS.guests,
                                guests
                            );


                            renderGuests();

                            updateDashboardStats();

                            showToast(
                                "Guest deleted."
                            );

                        }

                    }
                );

            }
        );

}


/* =========================================
   RENDER BOOKINGS
========================================= */

function renderBookings() {

    const table =
        document.getElementById(
            "bookingTable"
        );


    if (!table) {

        return;

    }


    const tbody =
        table.querySelector(
            "tbody"
        );


    tbody.innerHTML = "";


    if (bookings.length === 0) {

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="8"
                    style="text-align:center;padding:40px"
                >

                    No bookings found.

                </td>

            </tr>

        `;

        return;

    }


    bookings.forEach(
        function (booking) {

            const row =
                document.createElement(
                    "tr"
                );


            const statusClass =
                booking.status
                    .toLowerCase();


            row.innerHTML = `

                <td>
                    ${booking.id}
                </td>

                <td>
                    ${booking.guest}
                </td>

                <td>
                    ${booking.room}
                </td>

                <td>
                    ${formatDate(
                        booking.checkIn
                    )}
                </td>

                <td>
                    ${formatDate(
                        booking.checkOut
                    )}
                </td>

                <td>
                    ₹${Number(
                        booking.amount
                    ).toLocaleString("en-IN")}
                </td>

                <td>

                    <span
                        class="status ${statusClass}"
                    >
                        ${booking.status}
                    </span>

                </td>

                <td>

                    <div class="table-actions">

                        <button
                            class="table-action edit-action"
                            data-edit-booking="${booking.id}"
                        >
                            ✎
                        </button>

                        <button
                            class="table-action delete-action"
                            data-delete-booking="${booking.id}"
                        >
                            ×
                        </button>

                    </div>

                </td>

            `;


            tbody.appendChild(row);

        }
    );


    addBookingActionListeners();
filterBookings();

}


/* =========================================
   BOOKING ACTIONS
========================================= */

function addBookingActionListeners() {

    document
        .querySelectorAll(
            "[data-edit-booking]"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const id =
                            button.dataset
                                .editBooking;


                        const booking =
                            bookings.find(
                                item =>
                                    item.id ===
                                    id
                            );


                        if (booking) {

                            openModal(
                                "booking",
                                booking
                            );

                        }

                    }
                );

            }
        );


    document
        .querySelectorAll(
            "[data-delete-booking]"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const id =
                            button.dataset
                                .deleteBooking;


                        if (
                            confirm(
                                "Delete this booking?"
                            )
                        ) {

                            bookings =
                                bookings.filter(
                                    booking =>
                                        booking.id !==
                                        id
                                );


                            saveData(
                                STORAGE_KEYS.bookings,
                                bookings
                            );


                            renderBookings();

                            updateDashboardStats();

                            showToast(
                                "Booking deleted."
                            );

                        }

                    }
                );

            }
        );

}


/* =========================================
   DATE FORMAT
========================================= */

function formatDate(dateString) {

    if (!dateString) {

        return "-";

    }


    return new Date(
        dateString
    ).toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short"
        }
    );

}

function updateDashboardStats() {
    const validBookings = bookings.filter(
        booking => booking.status !== "Cancelled"
    );

    const totalRevenue = validBookings.reduce(
        (total, booking) => total + Number(booking.amount || 0),
        0
    );

    const totalRooms = rooms.length;

    const availableRooms = rooms.filter(
        room => room.status === "Available"
    ).length;

    const occupiedRooms = rooms.filter(
        room => room.status === "Occupied"
    ).length;

    const cleaningRooms = rooms.filter(
        room => room.status === "Cleaning"
    ).length;

    const maintenanceRooms = rooms.filter(
        room => room.status === "Maintenance"
    ).length;

    const occupancyRate =
        totalRooms > 0
            ? Math.round((occupiedRooms / totalRooms) * 100)
            : 0;

    document.getElementById("totalRevenue").textContent =
        "₹" + totalRevenue.toLocaleString("en-IN");

    document.getElementById("occupancyRate").textContent =
        occupancyRate + "%";

    document.getElementById("totalBookings").textContent =
        bookings.length;

    document.getElementById("totalGuests").textContent =
        guests.length;

    document.getElementById("availableRooms").textContent =
        availableRooms;

    document.getElementById("occupiedRooms").textContent =
        occupiedRooms;

    document.getElementById("cleaningRooms").textContent =
        cleaningRooms;

    document.getElementById("maintenanceRooms").textContent =
        maintenanceRooms;
}


/* =========================================
   OCCUPANCY
========================================= */

function updateOccupancy(
    total,
    available,
    occupied,
    maintenance
) {

    const circle =
        document.querySelector(
            ".circle-chart"
        );


    const occupiedText =
        document.querySelector(
            ".circle-inner strong"
        );


    if (!circle) {

        return;

    }


    const percentage =
        total > 0
            ? Math.round(
                (occupied / total) *
                100
            )
            : 0;


    if (occupiedText) {

        occupiedText.textContent =
            `${percentage}%`;

    }


    circle.style.background =
        `conic-gradient(
            var(--gold) 0deg
            ${percentage * 3.6}deg,
            #e8ece9
            ${percentage * 3.6}deg
            360deg
        )`;


    const details =
        document.querySelector(
            ".occupancy-details"
        );


    if (details) {

        const values =
            details.querySelectorAll(
                "strong"
            );


        if (values.length >= 3) {

            values[0].textContent =
                available;

            values[1].textContent =
                occupied;

            values[2].textContent =
                maintenance;

        }

    }

}


/* =========================================
   CURRENCY
========================================= */

function formatCurrencyShort(
    amount
) {

    if (amount >= 100000) {

        return "₹" +
            (
                amount / 100000
            ).toFixed(2) +
            "L";

    }


    if (amount >= 1000) {

        return "₹" +
            (
                amount / 1000
            ).toFixed(1) +
            "K";

    }


    return "₹" +
        amount.toLocaleString(
            "en-IN"
        );

}


/* =========================================
   QUICK ACTIONS
========================================= */

document
    .querySelectorAll(
        ".quick-action"
    )
    .forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const action =
                        button.dataset.action;


                    if (
                        action ===
                        "booking"
                    ) {

                        showSection(
                            "bookings"
                        );

                        setTimeout(
                            function () {

                                openModal(
                                    "booking"
                                );

                            },
                            200
                        );

                    }


                    else if (
                        action ===
                        "room"
                    ) {

                        showSection(
                            "rooms"
                        );

                        setTimeout(
                            function () {

                                openModal(
                                    "room"
                                );

                            },
                            200
                        );

                    }


                    else if (
                        action ===
                        "guest"
                    ) {

                        showSection(
                            "guests"
                        );

                        setTimeout(
                            function () {

                                openModal(
                                    "guest"
                                );

                            },
                            200
                        );

                    }


                    else if (
                        action ===
                        "report"
                    ) {

                        generateReport();

                    }

                }
            );

        }
    );


/* =========================================
   ADD BUTTONS
========================================= */

document
    .querySelectorAll(
        ".primary-action"
    )
    .forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const text =
                        button.textContent
                            .toLowerCase();


                    if (
                        text.includes(
                            "booking"
                        )
                    ) {

                        openModal(
                            "booking"
                        );

                    }


                    else if (
                        text.includes(
                            "room"
                        )
                    ) {

                        openModal(
                            "room"
                        );

                    }


                    else if (
                        text.includes(
                            "guest"
                        )
                    ) {

                        openModal(
                            "guest"
                        );

                    }

                }
            );

        }
    );


/* =========================================
   BOOKING SEARCH
========================================= */

const bookingSearch =
    document.getElementById(
        "bookingSearch"
    );

const bookingStatus =
    document.getElementById(
        "bookingStatus"
    );


function filterBookings() {

    const table =
        document.getElementById(
            "bookingTable"
        );


    if (!table) {

        return;

    }


    const search =
        bookingSearch
            ? bookingSearch.value
                .toLowerCase()
                .trim()
            : "";


    const status =
        bookingStatus
            ? bookingStatus.value
            : "all";


    const rows =
        table.querySelectorAll(
            "tbody tr"
        );


    rows.forEach(
        function (row) {

            const text =
                row.textContent
                    .toLowerCase();


            const statusElement =
                row.querySelector(
                    ".status"
                );


            const rowStatus =
                statusElement
                    ? statusElement.textContent
                        .trim()
                        .toLowerCase()
                    : "";


            const searchMatch =
                text.includes(
                    search
                );


            const statusMatch =
                status === "all" ||
                rowStatus ===
                    status;


            row.style.display =
                searchMatch &&
                statusMatch
                    ? ""
                    : "none";

        }
    );

}


if (bookingSearch) {

    bookingSearch.addEventListener(
        "input",
        filterBookings
    );

}


if (bookingStatus) {

    bookingStatus.addEventListener(
        "change",
        filterBookings
    );

}


/* =========================================
   VIEW ALL BOOKINGS
========================================= */

document
    .querySelectorAll(
        ".view-all-btn"
    )
    .forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    showSection(
                        "bookings"
                    );

                }
            );

        }
    );


/* =========================================
   NOTIFICATION
========================================= */

const notificationBtn =
    document.getElementById(
        "notificationBtn"
    );


if (notificationBtn) {

    notificationBtn.addEventListener(
        "click",
        function () {

            showToast(
                "You have 3 new notifications."
            );

        }
    );

}


/* =========================================
   TOAST
========================================= */

function showToast(message) {

    const toast =
        document.getElementById(
            "toast"
        );

    const toastMessage =
        document.getElementById(
            "toastMessage"
        );


    if (!toast) {

        return;

    }


    toastMessage.textContent =
        message;


    toast.classList.add(
        "show"
    );


    setTimeout(
        function () {

            toast.classList.remove(
                "show"
            );

        },
        2500
    );

}


/* =========================================
   GENERATE REPORT
========================================= */

function generateReport() {

    const totalRevenue =
        bookings
            .filter(
                booking =>
                    booking.status !==
                    "Cancelled"
            )
            .reduce(
                (
                    total,
                    booking
                ) =>
                    total +
                    Number(
                        booking.amount
                    ),
                0
            );


    const report = `

GRANDVISTA HOTEL
HOTEL MANAGEMENT REPORT
================================

Total Rooms: ${rooms.length}

Available Rooms:
${rooms.filter(
    room =>
        room.status ===
        "Available"
).length}

Occupied Rooms:
${rooms.filter(
    room =>
        room.status ===
        "Occupied"
).length}

Maintenance Rooms:
${rooms.filter(
    room =>
        room.status ===
        "Maintenance"
).length}

Total Guests:
${guests.length}

Total Bookings:
${bookings.length}

Total Revenue:
₹${totalRevenue.toLocaleString("en-IN")}

================================
Generated:
${new Date().toLocaleString("en-IN")}
`;


    const blob =
        new Blob(
            [report],
            {
                type:
                    "text/plain"
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    link.href = url;

    link.download =
        "grandvista-hotel-report.txt";

    link.click();


    URL.revokeObjectURL(
        url
    );


    showToast(
        "Report generated successfully."
    );

}


/* =========================================
   INITIAL RENDER
========================================= */

refreshDashboard();


/* =========================================
   REFRESH WHEN PAGE BECOMES ACTIVE
========================================= */

window.addEventListener(
    "pageshow",
    function () {

        refreshDashboard();

    }
);


/* =========================================
   REFRESH WHEN BROWSER WINDOW GETS FOCUS
========================================= */

window.addEventListener(
    "focus",
    function () {

        refreshDashboard();

    }
);

fetch("http://127.0.0.1:8000/analytics/dashboard")
  .then(response => response.json())
  .then(data => {
    document.getElementById("revenue").innerText = "₹" + data.total_revenue;
    document.getElementById("occupancy").innerText = JSON.stringify(data.occupancy_rate);
    document.getElementById("stay").innerText = data.average_stay_days.toFixed(2) + " days";
    document.getElementById("payments").innerText = JSON.stringify(data.payment_distribution);
  })
  .catch(error => console.error("Error fetching dashboard data:", error));
