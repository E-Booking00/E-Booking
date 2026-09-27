/* =========================================================
   E BOOKING - MAIN JAVASCRIPT
========================================================= */


/* =========================
   GLOBAL SETTINGS
========================= */

const ticketPrice = 150;

const bookingStorageKey = "eBookingBookings";
const userNameStorageKey = "eBookingUserName";
const pendingBookingKey = "eBookingPendingBooking";

/* Cancellation allowed for 30 minutes */
const cancellationLimit = 30 * 60 * 1000;

let currentSlide = 0;


/* =========================================================
   CAROUSEL
========================================================= */

const track = document.querySelector(".carousel-track");
const dots = document.querySelectorAll(".dot");


function moveCarousel(direction) {

    const cards = document.querySelectorAll(
        ".carousel-track .movie-card"
    );

    if (cards.length === 0) {
        return;
    }

    currentSlide += direction;

    if (currentSlide < 0) {
        currentSlide = cards.length - 1;
    }

    if (currentSlide >= cards.length) {
        currentSlide = 0;
    }

    updateCarousel();
}


function goToSlide(slide) {

    currentSlide = slide;

    updateCarousel();
}


function updateCarousel() {

    const cards = document.querySelectorAll(
        ".carousel-track .movie-card"
    );

    if (cards.length === 0 || !track) {
        return;
    }

    const gap = parseFloat(
        getComputedStyle(track).gap
    ) || 0;

    const cardWidth =
        cards[0].offsetWidth + gap;

    track.style.transform =
        "translateX(-" +
        (currentSlide * cardWidth) +
        "px";


    dots.forEach(function(dot, index) {

        dot.classList.remove("active");

        if (index === currentSlide) {
            dot.classList.add("active");
        }

    });
}


/* Automatic carousel */

if (track) {

    setInterval(function() {

        moveCarousel(1);

    }, 4000);

}


/* Update carousel when window size changes */

window.addEventListener("resize", function() {

    if (track) {
        updateCarousel();
    }

});


/* =========================================================
   BOOK MOVIE
========================================================= */

function bookMovie(movieName) {

    window.location.href =
        "booking.html?movie=" +
        encodeURIComponent(movieName);

}


/* =========================================================
   LOCAL STORAGE HELPERS
========================================================= */

function getBookings() {

    const savedBookings =
        localStorage.getItem(bookingStorageKey);

    if (!savedBookings) {
        return [];
    }

    try {

        return JSON.parse(savedBookings);

    } catch (error) {

        return [];

    }

}


function saveBookings(bookings) {

    localStorage.setItem(
        bookingStorageKey,
        JSON.stringify(bookings)
    );

}


/* =========================================================
   GENERATE BOOKING ID
========================================================= */

function generateBookingId() {

    const randomNumber =
        Math.floor(100000 + Math.random() * 900000);

    return "EB" + randomNumber;

}


/* =========================================================
   GENERATE VERIFICATION CODE
========================================================= */

function generateVerificationCode() {

    return String(
        Math.floor(100000 + Math.random() * 900000)
    );

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

    if (value === undefined || value === null) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================================
   USER NAME
========================================================= */

const userNameInput =
    document.getElementById("userName");


if (userNameInput) {

    const savedUserName =
        localStorage.getItem(userNameStorageKey);

    if (savedUserName) {

        userNameInput.value =
            savedUserName;

    }


    userNameInput.addEventListener(
        "input",
        function() {

            localStorage.setItem(
                userNameStorageKey,
                userNameInput.value.trim()
            );

        }
    );

}


/* =========================================================
   AUTO SELECT MOVIE
========================================================= */

const urlParams =
    new URLSearchParams(window.location.search);

const selectedMovie =
    urlParams.get("movie");

const movieSelect =
    document.getElementById("movieSelect");


if (selectedMovie && movieSelect) {

    movieSelect.value =
        selectedMovie;

}


/* =========================================================
   DATE - PREVENT PAST DATES
========================================================= */

const bookingDate =
    document.getElementById("bookingDate");


if (bookingDate) {

    const today =
        new Date().toISOString().split("T")[0];

    bookingDate.min = today;

}


/* =========================================================
   SEAT FUNCTIONS
========================================================= */

function createShowKey(movie, date, time) {

    return movie +
        "|" +
        date +
        "|" +
        time;

}


function getOccupiedSeats(movie, date, time) {

    if (!movie || !date || !time) {
        return [];
    }

    const showKey =
        createShowKey(
            movie,
            date,
            time
        );

    const bookings =
        getBookings();

    const occupiedSeats = [];


    bookings.forEach(function(booking) {

        if (
            booking.showKey === showKey &&
            booking.status === "confirmed"
        ) {

            booking.seats.forEach(function(seat) {

                if (
                    !occupiedSeats.includes(seat)
                ) {

                    occupiedSeats.push(seat);

                }

            });

        }

    });


    return occupiedSeats;

}


/* =========================================================
   UPDATE OCCUPIED SEATS
========================================================= */

function updateOccupiedSeats() {

    const movieElement =
        document.getElementById("movieSelect");

    const dateElement =
        document.getElementById("bookingDate");

    const timeElement =
        document.getElementById("showTime");


    if (
        !movieElement ||
        !dateElement ||
        !timeElement
    ) {
        return;
    }


    const movie =
        movieElement.value;

    const date =
        dateElement.value;

    const time =
        timeElement.value;


    const occupiedSeats =
        getOccupiedSeats(
            movie,
            date,
            time
        );


    const allSeats =
        document.querySelectorAll(".seat");


    allSeats.forEach(function(seat) {

        const seatName =
            seat.dataset.seat ||
            seat.textContent.trim();


        seat.classList.remove("occupied");

        seat.disabled = false;


        if (
            occupiedSeats.includes(seatName)
        ) {

            seat.classList.add("occupied");

            seat.classList.remove("selected");

            seat.disabled = true;

        }

    });


    updateBookingSummary();

}


/* =========================================================
   SEAT SELECTION
========================================================= */

function setupSeats() {

    const allSeats =
        document.querySelectorAll(".seat");


    allSeats.forEach(function(seat) {

        seat.addEventListener(
            "click",
            function() {

                if (
                    seat.classList.contains("occupied") ||
                    seat.disabled
                ) {
                    return;
                }


                seat.classList.toggle("selected");


                updateBookingSummary();

            }
        );

    });

}


setupSeats();


/* =========================================================
   MOVIE / DATE / TIME CHANGE
========================================================= */

if (movieSelect) {

    movieSelect.addEventListener(
        "change",
        function() {

            updateOccupiedSeats();

        }
    );

}


if (bookingDate) {

    bookingDate.addEventListener(
        "change",
        function() {

            updateOccupiedSeats();

        }
    );

}


const showTime =
    document.getElementById("showTime");


if (showTime) {

    showTime.addEventListener(
        "change",
        function() {

            updateOccupiedSeats();

        }
    );

}


/* =========================================================
   BOOKING SUMMARY
========================================================= */

function updateBookingSummary() {

    const selectedSeats =
        document.querySelectorAll(
            ".seat.selected"
        );


    const seatCount =
        selectedSeats.length;


    const totalAmount =
        seatCount * ticketPrice;


    const selectedSeatsElement =
        document.getElementById(
            "selectedSeats"
        );


    const ticketPriceElement =
        document.getElementById(
            "ticketPrice"
        );


    const totalAmountElement =
        document.getElementById(
            "totalAmount"
        );


    if (selectedSeatsElement) {

        selectedSeatsElement.textContent =
            seatCount;

    }


    if (ticketPriceElement) {

        ticketPriceElement.textContent =
            ticketPrice;

    }


    if (totalAmountElement) {

        totalAmountElement.textContent =
            totalAmount;

    }

}


/* =========================================================
   CONFIRM BOOKING
========================================================= */

function confirmBooking() {

    const userNameElement =
        document.getElementById("userName");


    const movieElement =
        document.getElementById("movieSelect");


    const dateElement =
        document.getElementById("bookingDate");


    const timeElement =
        document.getElementById("showTime");


    if (
        !userNameElement ||
        !movieElement ||
        !dateElement ||
        !timeElement
    ) {

        return;

    }


    const userName =
        userNameElement.value.trim();


    const movie =
        movieElement.value;


    const date =
        dateElement.value;


    const time =
        timeElement.value;


    const selectedSeats =
        document.querySelectorAll(
            ".seat.selected"
        );


    /* CHECK NAME */

    if (userName === "") {

        alert(
            "Please enter your name."
        );

        userNameElement.focus();

        return;

    }


    /* CHECK MOVIE */

    if (movie === "") {

        alert(
            "Please select a movie."
        );

        return;

    }


    /* CHECK DATE */

    if (date === "") {

        alert(
            "Please select a date."
        );

        return;

    }


    /* CHECK TIME */

    if (time === "") {

        alert(
            "Please select a show time."
        );

        return;

    }


    /* CHECK SEATS */

    if (selectedSeats.length === 0) {

        alert(
            "Please select at least one seat."
        );

        return;

    }


    /* GET SEAT NAMES */

    const seatNames = [];


    selectedSeats.forEach(function(seat) {

        const seatName =
            seat.dataset.seat ||
            seat.textContent.trim();


        seatNames.push(seatName);

    });


    /* DOUBLE CHECK OCCUPIED SEATS */

    const occupiedSeats =
        getOccupiedSeats(
            movie,
            date,
            time
        );


    const alreadyBooked =
        seatNames.filter(function(seat) {

            return occupiedSeats.includes(seat);

        });


    if (alreadyBooked.length > 0) {

        alert(
            "These seats are already occupied: " +
            alreadyBooked.join(", ")
        );

        updateOccupiedSeats();

        return;

    }


    /* TOTAL */

    const totalAmount =
        selectedSeats.length *
        ticketPrice;


    /* BOOKING ID */

    const bookingId =
        generateBookingId();


    /* VERIFICATION CODE */

    const verificationCode =
        generateVerificationCode();


    /* SHOW KEY */

    const showKey =
        createShowKey(
            movie,
            date,
            time
        );


    /* CREATE PENDING BOOKING */

    const pendingBooking = {

        id: bookingId,

        userName: userName,

        movie: movie,

        date: date,

        time: time,

        seats: seatNames,

        amount: totalAmount,

        showKey: showKey,

        status: "pending",

        verificationCode: verificationCode,

        createdAt:
            new Date().toISOString()

    };


    /* SAVE PENDING BOOKING */

    localStorage.setItem(
        pendingBookingKey,
        JSON.stringify(
            pendingBooking
        )
    );


    /* SAVE USER NAME */

    localStorage.setItem(
        userNameStorageKey,
        userName
    );


    /* OPEN VERIFICATION POPUP */

    openVerificationPopup(
        verificationCode
    );

}


/* =========================================================
   VERIFICATION POPUP
========================================================= */

function openVerificationPopup(code) {

    const popup =
        document.getElementById(
            "verificationPopup"
        );


    const codeDisplay =
        document.getElementById(
            "verificationCodeDisplay"
        );


    const input =
        document.getElementById(
            "verificationInput"
        );


    const error =
        document.getElementById(
            "verificationError"
        );


    if (!popup) {
        return;
    }


    if (codeDisplay) {

        codeDisplay.textContent =
            code;

    }


    if (input) {

        input.value = "";

    }


    if (error) {

        error.textContent = "";

    }


    popup.classList.add("show");


    setTimeout(function() {

        if (input) {
            input.focus();
        }

    }, 100);

}


/* =========================================================
   CLOSE VERIFICATION POPUP
========================================================= */

function closeVerificationPopup() {

    const popup =
        document.getElementById(
            "verificationPopup"
        );


    if (popup) {

        popup.classList.remove("show");

    }

}


/* =========================================================
   VERIFY BOOKING CODE
========================================================= */

function verifyBookingCode() {

    const input =
        document.getElementById(
            "verificationInput"
        );


    const error =
        document.getElementById(
            "verificationError"
        );


    const savedPending =
        localStorage.getItem(
            pendingBookingKey
        );


    if (!savedPending) {

        if (error) {

            error.textContent =
                "Booking session expired. Please try again.";

        }

        return;

    }


    let booking;


    try {

        booking =
            JSON.parse(savedPending);

    } catch (e) {

        if (error) {

            error.textContent =
                "Something went wrong. Please try again.";

        }

        return;

    }


    const enteredCode =
        input
            ? input.value.trim()
            : "";


    /* CHECK CODE */

    if (
        enteredCode !==
        booking.verificationCode
    ) {

        if (error) {

            error.textContent =
                "❌ Incorrect verification code. Try again.";

        }

        return;

    }


    /* CONFIRM BOOKING */

    booking.status =
        "confirmed";


    /* GET EXISTING BOOKINGS */

    const bookings =
        getBookings();


    /* SAVE CONFIRMED BOOKING */

    bookings.push(booking);


    saveBookings(bookings);


    /* SAVE LAST BOOKING */

    localStorage.setItem(
        "bookingData",
        JSON.stringify(
            booking
        )
    );


    /* REMOVE PENDING BOOKING */

    localStorage.removeItem(
        pendingBookingKey
    );


    /* CLOSE POPUP */

    closeVerificationPopup();


    /* GO TO CONFIRMATION */

    window.location.href =
        "confirmation.html";

}


/* =========================================================
   ENTER KEY FOR VERIFICATION
========================================================= */

const verificationInput =
    document.getElementById(
        "verificationInput"
    );


if (verificationInput) {

    verificationInput.addEventListener(
        "keydown",
        function(event) {

            if (
                event.key === "Enter"
            ) {

                verifyBookingCode();

            }

        }
    );

}


/* =========================================================
   LOAD CONFIRMATION DATA
========================================================= */

function loadConfirmationData() {

    const confirmMovie =
        document.getElementById(
            "confirmMovie"
        );


    if (!confirmMovie) {
        return;
    }


    const savedBooking =
        localStorage.getItem(
            "bookingData"
        );


    if (!savedBooking) {

        return;

    }


    let booking;


    try {

        booking =
            JSON.parse(savedBooking);

    } catch (error) {

        return;

    }


    const confirmBookingId =
        document.getElementById(
            "confirmBookingId"
        );


    const confirmUserName =
        document.getElementById(
            "confirmUserName"
        );


    const confirmDate =
        document.getElementById(
            "confirmDate"
        );


    const confirmTime =
        document.getElementById(
            "confirmTime"
        );


    const confirmSeats =
        document.getElementById(
            "confirmSeats"
        );


    const confirmAmount =
        document.getElementById(
            "confirmAmount"
        );


    if (confirmBookingId) {

        confirmBookingId.textContent =
            booking.id || "-";

    }


    if (confirmUserName) {

        confirmUserName.textContent =
            booking.userName || "-";

    }


    if (confirmMovie) {

        confirmMovie.textContent =
            booking.movie || "-";

    }


    if (confirmDate) {

        confirmDate.textContent =
            booking.date || "-";

    }


    if (confirmTime) {

        confirmTime.textContent =
            booking.time || "-";

    }


    if (confirmSeats) {

        confirmSeats.textContent =
            Array.isArray(booking.seats)
                ? booking.seats.join(", ")
                : booking.seats || "-";

    }


    if (confirmAmount) {

        confirmAmount.textContent =
            booking.amount || 0;

    }

}


loadConfirmationData();


/* =========================================================
   CHECK CANCELLATION TIME
========================================================= */

function canCancelBooking(booking) {

    if (
        !booking ||
        !booking.createdAt
    ) {

        return false;

    }


    const bookingTime =
        new Date(
            booking.createdAt
        ).getTime();


    const currentTime =
        new Date().getTime();


    const timePassed =
        currentTime - bookingTime;


    return timePassed <= cancellationLimit;

}


/* =========================================================
   GET REMAINING CANCELLATION TIME
========================================================= */

function getRemainingCancellationTime(booking) {

    if (
        !booking ||
        !booking.createdAt
    ) {

        return 0;

    }


    const bookingTime =
        new Date(
            booking.createdAt
        ).getTime();


    const currentTime =
        new Date().getTime();


    const timePassed =
        currentTime - bookingTime;


    const remaining =
        cancellationLimit - timePassed;


    return Math.max(
        0,
        remaining
    );

}


/* =========================================================
   BOOKING HISTORY
========================================================= */

function loadBookingHistory() {

    const historyContainer =
        document.getElementById(
            "historyContainer"
        );


    if (!historyContainer) {
        return;
    }


    const bookings =
        getBookings();


    if (bookings.length === 0) {

        historyContainer.innerHTML =
            '<p class="no-history">No booking history available.</p>';

        return;

    }


    /* NEWEST BOOKINGS FIRST */

    const sortedBookings =
        [...bookings].reverse();


    let historyHTML = "";


    sortedBookings.forEach(function(booking) {

        const statusClass =
            booking.status === "confirmed"
                ? "history-confirmed"
                : "history-cancelled";


        const statusText =
            booking.status === "confirmed"
                ? "CONFIRMED"
                : "CANCELLED";


        const seatsText =
            Array.isArray(booking.seats)
                ? booking.seats.join(", ")
                : booking.seats;


        /* =========================
           CANCELLATION BUTTON
        ========================= */

        let cancellationHTML = "";


        if (
            booking.status === "confirmed"
        ) {

            if (
                canCancelBooking(booking)
            ) {

                const remainingTime =
                    getRemainingCancellationTime(
                        booking
                    );


                const remainingMinutes =
                    Math.ceil(
                        remainingTime /
                        (60 * 1000)
                    );


                cancellationHTML = `

                    <button
                        class="cancel-booking-btn"
                        onclick="cancelBooking('${booking.id}')"
                    >
                        ❌ Cancel Booking
                    </button>

                    <p class="cancel-time">

                        ⏳ Cancellation available for
                        ${remainingMinutes}
                        minute(s)

                    </p>

                `;

            } else {

                cancellationHTML = `

                    <p class="cancel-expired">

                        ⏳ Cancellation period expired
                        (30 minutes)

                    </p>

                `;

            }

        } else {

            cancellationHTML = `

                <p class="cancelled-message">

                    This booking has been cancelled.

                </p>

            `;

        }


        /* =========================
           HISTORY CARD
        ========================= */

        historyHTML += `

            <div class="history-card">

                <div class="history-header">

                    <h3>
                        🎬 ${escapeHTML(booking.movie)}
                    </h3>

                    <span class="${statusClass}">
                        ${statusText}
                    </span>

                </div>


                <div class="history-details">

                    <p>
                        🎟️ <strong>Booking ID:</strong>
                        ${escapeHTML(booking.id)}
                    </p>

                    <p>
                        👤 <strong>Name:</strong>
                        ${escapeHTML(booking.userName)}
                    </p>

                    <p>
                        📅 <strong>Date:</strong>
                        ${escapeHTML(booking.date)}
                    </p>

                    <p>
                        🕐 <strong>Time:</strong>
                        ${escapeHTML(booking.time)}
                    </p>

                    <p>
                        💺 <strong>Seats:</strong>
                        ${escapeHTML(seatsText)}
                    </p>

                    <p>
                        💰 <strong>Amount:</strong>
                        ₹${escapeHTML(booking.amount)}
                    </p>

                </div>


                ${cancellationHTML}

            </div>

        `;

    });


    historyContainer.innerHTML =
        historyHTML;

}


/* =========================================================
   CANCEL BOOKING
========================================================= */

function cancelBooking(bookingId) {

    const bookings =
        getBookings();


    const bookingIndex =
        bookings.findIndex(
            function(booking) {

                return booking.id === bookingId;

            }
        );


    if (bookingIndex === -1) {

        alert(
            "Booking not found."
        );

        return;

    }


    const booking =
        bookings[bookingIndex];


    /* CHECK ALREADY CANCELLED */

    if (
        booking.status === "cancelled"
    ) {

        alert(
            "This booking is already cancelled."
        );

        return;

    }


    /* =====================================================
       CHECK 30-MINUTE CANCELLATION LIMIT
    ===================================================== */

    if (
        !canCancelBooking(booking)
    ) {

        alert(
            "Cancellation period has expired. " +
            "Bookings can only be cancelled within 30 minutes."
        );


        loadBookingHistory();

        return;

    }


    /* CONFIRM CANCELLATION */

    const confirmed =
        confirm(
            "Are you sure you want to cancel this booking?"
        );


    if (!confirmed) {
        return;
    }


    /* CANCEL BOOKING */

    booking.status =
        "cancelled";


    booking.cancelledAt =
        new Date().toISOString();


    saveBookings(bookings);


    /* UPDATE HISTORY */

    loadBookingHistory();


    /* UPDATE SEATS IF BOOKING PAGE IS OPEN */

    updateOccupiedSeats();


    alert(
        "Booking cancelled successfully. " +
        "The seats are now available again."
    );

}


/* =========================================================
   HOME BUTTON
========================================================= */

function goHome() {

    window.location.href =
        "index.html";

}


/* =========================================================
   HISTORY BUTTON
========================================================= */

function goToHistory() {

    window.location.href =
        "index.html#booking-history";

}


/* =========================================================
   LOAD HISTORY
========================================================= */

loadBookingHistory();


/* =========================================================
   SCROLL REVEAL
========================================================= */

const revealElements =
    document.querySelectorAll(
        ".movies-section, footer"
    );


if (
    "IntersectionObserver" in window
) {

    const revealObserver =
        new IntersectionObserver(

            function(entries) {

                entries.forEach(
                    function(entry) {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.classList.add(
                                "show-section"
                            );


                            revealObserver.unobserve(
                                entry.target
                            );

                        }

                    }
                );

            },

            {
                threshold: 0.15
            }

        );


    revealElements.forEach(
        function(element) {

            element.classList.add(
                "hidden-section"
            );


            revealObserver.observe(
                element
            );

        }
    );

}


/* =========================================================
   INITIALIZE OCCUPIED SEATS
========================================================= */

if (
    document.querySelector(".seat")
) {

    updateOccupiedSeats();

}
