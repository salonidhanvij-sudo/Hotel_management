/* =========================================
   GRANDVISTA HOTEL
   MAIN JAVASCRIPT
========================================= */


/* =========================================
   MOBILE NAVIGATION
========================================= */

const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-menu");

if (menuToggle && navMenu) {

    menuToggle.addEventListener("click", function () {

        navMenu.classList.toggle("active");
        menuToggle.classList.toggle("active");

    });


    /* Close menu when clicking a link */

    const navLinks = navMenu.querySelectorAll("a");

    navLinks.forEach(function (link) {

        link.addEventListener("click", function () {

            navMenu.classList.remove("active");
            menuToggle.classList.remove("active");

        });

    });

}


/* =========================================
   HEADER SCROLL EFFECT
========================================= */

const header = document.querySelector(".header");

if (header) {

    window.addEventListener("scroll", function () {

        if (window.scrollY > 50) {

            header.classList.add("scrolled");

        } else {

            header.classList.remove("scrolled");

        }

    });

}


/* =========================================
   ACTIVE NAVIGATION LINK
========================================= */

const currentPage =
    window.location.pathname.split("/").pop();

/* Keep the footer content identical on every page. */
const footer = document.querySelector(".footer");

if (footer) {
    const rootPrefix =
        currentPage === "index.html" || currentPage === ""
            ? ""
            : "../";
    const pagesPrefix =
        rootPrefix === "" ? "pages/" : "";

    footer.innerHTML = `
        <div class="container footer-grid">
            <div class="footer-brand">
                <a href="${rootPrefix}index.html" class="logo">
                    <span class="logo-icon">G</span>
                    <span class="logo-text">
                        <strong>GrandVista</strong>
                        <small>HOTEL &amp; RESORT</small>
                    </span>
                </a>
                <p>
                    Thoughtful stays, exceptional dining and warm Pune hospitality&mdash;made personal.
                </p>
                <a href="${pagesPrefix}booking.html" class="footer-reserve-link">
                    Reserve your stay <span aria-hidden="true">&rarr;</span>
                </a>
            </div>

            <div class="footer-links">
                <h4>Quick Links</h4>
                <a href="${rootPrefix}index.html">Home</a>
                <a href="${pagesPrefix}rooms.html">Rooms</a>
                <a href="${pagesPrefix}services.html">Services</a>
                <a href="${pagesPrefix}about.html">About</a>
                <a href="${pagesPrefix}contact.html">Contact</a>
            </div>

            <div class="footer-links footer-experience">
                <h4>Experience</h4>
                <a href="${pagesPrefix}services.html">Dining &amp; Spa</a>
                <a href="${pagesPrefix}services.html">Pool &amp; Wellness</a>
                <a href="${pagesPrefix}booking.html">Special Offers</a>
                <a href="${pagesPrefix}contact.html">Meetings &amp; Events</a>
            </div>

            <div class="footer-contact">
                <h4>Contact</h4>
                <p>📍 Pune, Maharashtra</p>
                <p>☎ +91 98765 43210</p>
                <p>✉ hello@grandvista.com</p>
            </div>
        </div>

        <div class="container footer-bottom">
            <p>© 2026 GrandVista Hotel. All rights reserved.</p>
            <div class="footer-legal">
                <a href="${pagesPrefix}services.html?policy=privacy">Privacy</a>
                <a href="${pagesPrefix}services.html?policy=terms">Terms</a>
                <span>Designed in Pune</span>
            </div>
        </div>
    `;
}


const allNavLinks =
    document.querySelectorAll(".nav-menu a");

allNavLinks.forEach(function (link) {

    const href = link.getAttribute("href");

    if (!href) {
        return;
    }

    const linkPage =
        href.split("/").pop();

    if (
        linkPage === currentPage ||
        (currentPage === "" && linkPage === "index.html")
    ) {

        link.classList.add("active");

    }

});


/* =========================================
   SCROLL REVEAL ANIMATION
========================================= */

const revealElements =
    document.querySelectorAll(
        ".reveal, .room-card, .service-card, .home-service-card, .testimonial-card"
    );


function revealOnScroll() {

    revealElements.forEach(function (element) {

        const elementTop =
            element.getBoundingClientRect().top;

        const windowHeight =
            window.innerHeight;

        if (elementTop < windowHeight - 80) {

            element.classList.add("show");

        }

    });

}


window.addEventListener(
    "scroll",
    revealOnScroll
);

window.addEventListener(
    "load",
    revealOnScroll
);


/* =========================================
   SCROLL TO TOP BUTTON
========================================= */

const scrollTopButton =
    document.createElement("button");

scrollTopButton.className =
    "scroll-top";

scrollTopButton.innerHTML =
    "↑";

scrollTopButton.setAttribute(
    "aria-label",
    "Scroll to top"
);

document.body.appendChild(
    scrollTopButton
);


window.addEventListener(
    "scroll",
    function () {

        if (window.scrollY > 400) {

            scrollTopButton.classList.add("show");

        } else {

            scrollTopButton.classList.remove("show");

        }

    }
);


scrollTopButton.addEventListener(
    "click",
    function () {

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    }
);


/* =========================================
   GALLERY LIGHTBOX
========================================= */

const galleryItems =
    document.querySelectorAll(".gallery-item img");


if (galleryItems.length > 0) {

    const lightbox =
        document.createElement("div");

    lightbox.className =
        "lightbox";

    lightbox.innerHTML = `
        <button
            class="lightbox-close"
            aria-label="Close gallery">
            &times;
        </button>

        <img
            class="lightbox-image"
            src=""
            alt="Gallery Image"
        >
    `;

    document.body.appendChild(lightbox);


    const lightboxImage =
        lightbox.querySelector(".lightbox-image");

    const lightboxClose =
        lightbox.querySelector(".lightbox-close");


    galleryItems.forEach(function (image) {

        image.addEventListener(
            "click",
            function () {

                lightboxImage.src =
                    image.src;

                lightboxImage.alt =
                    image.alt;

                lightbox.classList.add("active");

                document.body.classList.add(
                    "no-scroll"
                );

            }
        );

    });


    lightboxClose.addEventListener(
        "click",
        closeLightbox
    );


    lightbox.addEventListener(
        "click",
        function (event) {

            if (event.target === lightbox) {

                closeLightbox();

            }

        }
    );


    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                lightbox.classList.contains("active")
            ) {

                closeLightbox();

            }

        }
    );


    function closeLightbox() {

        lightbox.classList.remove(
            "active"
        );

        document.body.classList.remove(
            "no-scroll"
        );

    }

}


/* =========================================
   FOOTER POLICY MODAL
========================================= */


/* =========================================
   OPEN POLICY MODAL
========================================= */

function openPolicy(type) {

    const modal =
        document.getElementById("policyModal");

    const title =
        document.getElementById("policyTitle");

    const content =
        document.getElementById("policyContent");


    /* Check if modal exists */

    if (!modal || !title || !content) {

        console.error(
            "Policy modal elements not found."
        );

        return;

    }

    /* =========================================
       PRIVACY POLICY
    ========================================= */

    if (type === "privacy") {

        title.innerText =
            "Privacy Policy";

        content.innerHTML = `

            <p>
                At GrandVista Hotel, we respect your privacy
                and are committed to protecting your personal
                information.
            </p>

            <h4>
                Information We Collect
            </h4>

            <p>
                We may collect information such as your name,
                email address, phone number, booking details,
                and other information required to provide
                our services.
            </p>

            <h4>
                How We Use Your Information
            </h4>

            <p>
                Your information may be used to process
                reservations, provide hotel services,
                communicate with you, and improve your
                experience with GrandVista Hotel.
            </p>

            <h4>
                Data Protection
            </h4>

            <p>
                We take reasonable measures to protect your
                personal information from unauthorized access
                or misuse.
            </p>

        `;

    }


    /* =========================================
       TERMS & CONDITIONS
    ========================================= */

    else if (type === "terms") {

        title.innerText =
            "Terms & Conditions";

        content.innerHTML = `

            <p>
                By using the GrandVista Hotel website and
                services, you agree to the following terms
                and conditions.
            </p>

            <h4>
                Reservations
            </h4>

            <p>
                All reservations are subject to room
                availability. Guests are responsible for
                providing accurate booking information.
            </p>

            <h4>
                Check-in & Check-out
            </h4>

            <p>
                Standard check-in and check-out times are
                subject to hotel policy and availability.
            </p>

            <h4>
                Guest Responsibilities
            </h4>

            <p>
                Guests are expected to respect hotel property,
                staff members, and other guests during their
                stay.
            </p>

        `;

    }


    /* =========================================
       CANCELLATION POLICY
    ========================================= */

    else if (type === "cancellation") {

        title.innerText =
            "Cancellation Policy";

        content.innerHTML = `

            <p>
                Our cancellation policy is designed to provide
                flexibility while helping us manage room
                availability.
            </p>

            <h4>
                Cancellation
            </h4>

            <p>
                Guests may cancel their reservation according
                to the cancellation terms applicable to
                their booking.
            </p>

            <h4>
                Late Cancellation
            </h4>

            <p>
                Cancellations made after the permitted
                cancellation period may be subject to
                applicable charges.
            </p>

            <h4>
                No-Show
            </h4>

            <p>
                Failure to arrive without cancelling the
                reservation may result in applicable charges.
            </p>

        `;

    }

    /* =========================================
       BOOKING POLICY
    ========================================= */

    else if (type === "booking") {

        title.innerText =
            "Booking Policy";

        content.innerHTML = `

            <p>
                Our booking policy helps us provide a smooth
                and reliable stay for every guest.
            </p>

            <h4>
                Reservation Details
            </h4>

            <p>
                Please provide accurate guest, contact, and
                payment details when making a reservation.
            </p>

            <h4>
                Check-in Requirements
            </h4>

            <p>
                A valid government-issued photo ID is required
                at check-in. The booking guest must be present
                to complete the check-in process.
            </p>

        `;

    }

    /* =========================================
       FREQUENTLY ASKED QUESTIONS
    ========================================= */

    else if (type === "faqs") {

        title.innerText =
            "Frequently Asked Questions";

        content.innerHTML = `

            <h4>
                What time is check-in and check-out?
            </h4>

            <p>
                Check-in and check-out times depend on your
                reservation. Please contact our front desk for
                assistance with early check-in or late check-out.
            </p>

            <h4>
                Can I request special arrangements?
            </h4>

            <p>
                Yes. Add your request during booking or contact
                our team before arrival, and we will do our best
                to accommodate it.
            </p>

            <h4>
                How can I contact the hotel?
            </h4>

            <p>
                Our front desk is available 24/7 at
                +91 98765 43210.
            </p>

        `;

    }


    /* =========================================
       INVALID POLICY TYPE
    ========================================= */

    else {

        console.error(
            "Invalid policy type:",
            type
        );

        return;

    }


    /* =========================================
       SHOW MODAL
    ========================================= */

    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");

    document.body.classList.add("no-scroll");

}


/* =========================================
   CLOSE POLICY MODAL
========================================= */

function closePolicy() {

    const modal =
        document.getElementById("policyModal");


    if (!modal) {

        return;

    }


    modal.classList.remove(
        "active"
    );

    modal.setAttribute("aria-hidden", "true");

    document.body.classList.remove(
        "no-scroll"
    );

}


/* =========================================
   CLOSE POLICY WHEN CLICKING OUTSIDE
========================================= */

document.addEventListener(
    "click",
    function (event) {

        const modal =
            document.getElementById("policyModal");


        if (
            modal &&
            event.target === modal &&
            modal.classList.contains("active")
        ) {

            closePolicy();

        }

    }
);


/* =========================================
   CLOSE POLICY WITH ESCAPE KEY
========================================= */

document.addEventListener(
    "keydown",
    function (event) {

        const modal =
            document.getElementById("policyModal");


        if (
            event.key === "Escape" &&
            modal &&
            modal.classList.contains("active")
        ) {

            closePolicy();

        }

    }
);