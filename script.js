/* =========================================================
   E BOOKING - COMPLETE SCRIPT.JS
   Frontend Movie Booking System
========================================================= */


/* =========================================================
   1. GLOBAL SETTINGS
========================================================= */

const ticketPrice = 150;
const maxSeatsPerBooking = 3;

const BOOKINGS_KEY = "eBookingBookings";
const USER_NAME_KEY = "eBookingUserName";
const USER_EMAIL_KEY = "eBookingUserEmail";
const PENDING_BOOKING_KEY = "eBookingPendingBooking";

const CANCELLATION_LIMIT = 30 * 60 * 1000; // 30 minutes
const OTP_VALIDITY = 10 * 60 * 1000;       // 10 minutes


/* =========================================================
   2. EMAILJS SETTINGS
========================================================= */

const EMAILJS_SERVICE_ID = "service_zaq9wdp";
const EMAILJS_OTP_TEMPLATE_ID = "template_xy9jkx6";
const EMAILJS_CONFIRMATION_TEMPLATE_ID = "template_cfth6rq";
const EMAILJS_PUBLIC_KEY = "FgADu2R62jHrBs2hT";


/* =========================================================
   3. INITIALIZE EMAILJS
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    if (typeof emailjs !== "undefined") {

        try {

            emailjs.init({
                publicKey: EMAILJS_PUBLIC_KEY
            });

            console.log("EmailJS initialized successfully.");

        } catch (error) {

            console.error(
                "EmailJS initialization error:",
                error
            );

        }

    } else {

        console.error(
            "EmailJS library not loaded."
        );

    }

});


/* =========================================================
   4. CAROUSEL
========================================================= */

let currentSlide = 0;


function getCarouselElements() {

    return {

        track:
            document.querySelector(".carousel-track"),

        cards:
            document.querySelectorAll(
                ".carousel-track .movie-card"
            ),

        dots:
            document.querySelectorAll(".dot")

    };

}


function updateCarousel() {

    const {
        track,
        cards,
        dots
    } = getCarouselElements();


    if (!track || cards.length === 0) {
        return;
    }


    const cardWidth =
        cards[0].offsetWidth;


    const computedStyle =
        window.getComputedStyle(track);


    const gap =
        parseFloat(computedStyle.gap) || 0;


    const moveAmount =
        cardWidth + gap;


    track.style.transform =
        `translateX(-${currentSlide * moveAmount}px)`;


    dots.forEach(function (dot, index) {

        dot.classList.toggle(
            "active",
            index === currentSlide
        );

    });

}


function moveCarousel(direction) {

    const { cards } =
        getCarouselElements();


    if (cards.length === 0) {
        return;
    }


    currentSlide += direction;


    if (currentSlide < 0) {

        currentSlide =
            cards.length - 1;

    }


    if (currentSlide >= cards.length) {

        currentSlide = 0;

    }


    updateCarousel();

}


function goToSlide(index) {

    const { cards } =
        getCarouselElements();


    if (cards.length === 0) {
        return;
    }


    if (
        index < 0 ||
        index >= cards.length
    ) {
        return;
    }


    currentSlide = index;

    updateCarousel();

}


window.addEventListener(
    "resize",
    function () {

        updateCarousel();

    }
);


/* =========================================================
   5. BOOK MOVIE
========================================================= */

function bookMovie(movieName) {

    if (!movieName) {
        return;
    }


    window.location.href =
        "booking.html?movie=" +
        encodeURIComponent(movieName);

}


/* =========================================================
   6. LOCAL STORAGE HELPERS
========================================================= */

function getBookings() {

    try {

        const data =
            localStorage.getItem(
                BOOKINGS_KEY
            );


        if (!data) {
            return [];
        }


        const bookings =
            JSON.parse(data);


        return Array.isArray(bookings)
            ? bookings
            : [];


    } catch (error) {

        console.error(
            "Error reading bookings:",
            error
        );

        return [];

    }

}


function saveBookings(bookings) {

    try {

        localStorage.setItem(
            BOOKINGS_KEY,
            JSON.stringify(bookings)
        );

    } catch (error) {

        console.error(
            "Error saving bookings:",
            error
        );

    }

}


function getPendingBooking() {

    try {

        const data =
            localStorage.getItem(
                PENDING_BOOKING_KEY
            );


        if (!data) {
            return null;
        }


        return JSON.parse(data);


    } catch (error) {

        console.error(
            "Error reading pending booking:",
            error
        );

        return null;

    }

}


function savePendingBooking(booking) {

    try {

        localStorage.setItem(
            PENDING_BOOKING_KEY,
            JSON.stringify(booking)
        );

    } catch (error) {

        console.error(
            "Error saving pending booking:",
            error
        );

    }

}


function removePendingBooking() {

    localStorage.removeItem(
        PENDING_BOOKING_KEY
    );

}


/* =========================================================
   7. USER DETAILS
========================================================= */

function saveUserDetails(name, email) {

    localStorage.setItem(
        USER_NAME_KEY,
        name
    );

    localStorage.setItem(
        USER_EMAIL_KEY,
        email
    );

}


function loadUserDetails() {

    const nameInput =
        document.getElementById(
            "userName"
        );


    const emailInput =
        document.getElementById(
            "userEmail"
        );


    if (nameInput) {

        const savedName =
            localStorage.getItem(
                USER_NAME_KEY
            );


        if (savedName) {

            nameInput.value =
                savedName;

        }

    }


    if (emailInput) {

        const savedEmail =
            localStorage.getItem(
                USER_EMAIL_KEY
            );


        if (savedEmail) {

            emailInput.value =
                savedEmail;

        }

    }

}


/* =========================================================
   8. BOOKING ID
========================================================= */

function generateBookingId() {

    const randomNumber =
        Math.floor(
            100000 +
            Math.random() * 900000
        );


    return "EB" + randomNumber;

}


/* =========================================================
   9. OTP GENERATION
========================================================= */

function generateOTP() {

    return Math.floor(
        100000 +
        Math.random() * 900000
    ).toString();

}


/* =========================================================
   10. ESCAPE HTML
========================================================= */

function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   11. DATE SETUP
========================================================= */

function getTodayString() {

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


    return `${year}-${month}-${day}`;

}


function setupBookingDate() {

    const dateInput =
        document.getElementById(
            "bookingDate"
        );


    if (!dateInput) {
        return;
    }


    const today =
        getTodayString();


    dateInput.min =
        today;


    if (!dateInput.value) {

        dateInput.value =
            today;

    }

}


/* =========================================================
   12. SHOW TIME HANDLING
========================================================= */

function updateShowTimes() {

    const dateInput =
        document.getElementById(
            "bookingDate"
        );


    const timeSelect =
        document.getElementById(
            "showTime"
        );


    if (
        !dateInput ||
        !timeSelect
    ) {

        return;

    }


    const selectedDate =
        dateInput.value;


    const today =
        getTodayString();


    const options =
        timeSelect.querySelectorAll(
            "option"
        );


    options.forEach(
        function (option) {

            if (!option.value) {
                return;
            }


            option.disabled =
                false;

        }
    );


    if (selectedDate !== today) {
        return;
    }


    const now =
        new Date();


    const currentHour =
        now.getHours();


    const currentMinute =
        now.getMinutes();


    options.forEach(
        function (option) {

            if (!option.value) {
                return;
            }


            const timeParts =
                option.value.match(
                    /(\d+):(\d+)\s*(AM|PM)/i
                );


            if (!timeParts) {
                return;
            }


            let hour =
                parseInt(
                    timeParts[1],
                    10
                );


            const minute =
                parseInt(
                    timeParts[2],
                    10
                );


            const period =
                timeParts[3].toUpperCase();


            if (
                period === "PM" &&
                hour !== 12
            ) {

                hour += 12;

            }


            if (
                period === "AM" &&
                hour === 12
            ) {

                hour = 0;

            }


            if (
                hour < currentHour ||
                (
                    hour === currentHour &&
                    minute <= currentMinute
                )
            ) {

                option.disabled =
                    true;

            }

        }
    );


    if (
        timeSelect.selectedOptions.length &&
        timeSelect.selectedOptions[0].disabled
    ) {

        timeSelect.value = "";

    }

}


/* =========================================================
   13. VALIDATE SELECTED SHOW TIME
========================================================= */

function isPastShowTime(date, time) {

    if (!date || !time) {
        return false;
    }


    const today =
        getTodayString();


    if (date !== today) {
        return false;
    }


    const timeParts =
        time.match(
            /(\d+):(\d+)\s*(AM|PM)/i
        );


    if (!timeParts) {
        return false;
    }


    let hour =
        parseInt(
            timeParts[1],
            10
        );


    const minute =
        parseInt(
            timeParts[2],
            10
        );


    const period =
        timeParts[3].toUpperCase();


    if (
        period === "PM" &&
        hour !== 12
    ) {

        hour += 12;

    }


    if (
        period === "AM" &&
        hour === 12
    ) {

        hour = 0;

    }


    const now =
        new Date();


    const currentHour =
        now.getHours();


    const currentMinute =
        now.getMinutes();


    if (hour < currentHour) {
        return true;
    }


    if (
        hour === currentHour &&
        minute <= currentMinute
    ) {

        return true;

    }


    return false;

}


/* =========================================================
   14. SEAT HELPERS
========================================================= */

function getAllSeats() {

    return document.querySelectorAll(
        ".seat"
    );

}


function getSelectedSeats() {

    const seats = [];


    document.querySelectorAll(
        ".seat.selected"
    ).forEach(
        function (seat) {

            if (
                !seat.classList.contains(
                    "occupied"
                )
            ) {

                seats.push(
                    seat.dataset.seat
                );

            }

        }
    );


    return seats;

}


function clearSelectedSeats() {

    document.querySelectorAll(
        ".seat.selected"
    ).forEach(
        function (seat) {

            seat.classList.remove(
                "selected"
            );

        }
    );

}


/* =========================================================
   15. FIND OCCUPIED SEATS
========================================================= */

function getOccupiedSeats() {

    const movieSelect =
        document.getElementById(
            "movieSelect"
        );


    const dateInput =
        document.getElementById(
            "bookingDate"
        );


    const timeSelect =
        document.getElementById(
            "showTime"
        );


    if (
        !movieSelect ||
        !dateInput ||
        !timeSelect
    ) {

        return [];

    }


    const movie =
        movieSelect.value;


    const date =
        dateInput.value;


    const time =
        timeSelect.value;


    if (
        !movie ||
        !date ||
        !time
    ) {

        return [];

    }


    const bookings =
        getBookings();


    const occupiedSeats = [];


    bookings.forEach(
        function (booking) {

            if (
                booking.status === "confirmed" &&
                booking.movie === movie &&
                booking.date === date &&
                booking.showTime === time
            ) {

                if (
                    Array.isArray(
                        booking.seats
                    )
                ) {

                    booking.seats.forEach(
                        function (seat) {

                            if (
                                !occupiedSeats.includes(
                                    seat
                                )
                            ) {

                                occupiedSeats.push(
                                    seat
                                );

                            }

                        }
                    );

                }

            }

        }
    );


    return occupiedSeats;

}


/* =========================================================
   16. UPDATE OCCUPIED SEATS
========================================================= */

function updateOccupiedSeats() {

    const seats =
        getAllSeats();


    if (seats.length === 0) {
        return;
    }


    clearSelectedSeats();


    const occupiedSeats =
        getOccupiedSeats();


    seats.forEach(
        function (seat) {

            const seatNumber =
                seat.dataset.seat;


            seat.classList.remove(
                "occupied"
            );


            if (
                occupiedSeats.includes(
                    seatNumber
                )
            ) {

                seat.classList.add(
                    "occupied"
                );

            }

        }
    );


    updateBookingSummary();

}


/* =========================================================
   17. SEAT CLICK
========================================================= */

function handleSeatClick(seat) {

    if (!seat) {
        return;
    }


    if (
        seat.classList.contains(
            "occupied"
        )
    ) {

        alert(
            "This seat is already occupied."
        );

        return;

    }


    const selectedSeats =
        getSelectedSeats();


    if (
        !seat.classList.contains(
            "selected"
        ) &&
        selectedSeats.length >=
        maxSeatsPerBooking
    ) {

        alert(
            `You can select maximum ${maxSeatsPerBooking} seats.`
        );

        return;

    }


    seat.classList.toggle(
        "selected"
    );


    updateBookingSummary();

}


/* =========================================================
   18. BOOKING SUMMARY
========================================================= */

function updateBookingSummary() {

    const selectedSeats =
        getSelectedSeats();


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
            selectedSeats.length > 0
                ? selectedSeats.join(", ")
                : "None";

    }


    if (ticketPriceElement) {

        ticketPriceElement.textContent =
            `₹${ticketPrice}`;

    }


    if (totalAmountElement) {

        totalAmountElement.textContent =
            `₹${selectedSeats.length * ticketPrice}`;

    }

}


/* =========================================================
   19. GMAIL VALIDATION
========================================================= */

function isValidGmail(email) {

    const gmailPattern =
        /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;


    return gmailPattern.test(
        email
    );

}


/* =========================================================
   20. SEND OTP EMAIL
========================================================= */

async function sendOTPEmail(booking) {

    if (
        typeof emailjs === "undefined"
    ) {

        throw new Error(
            "EmailJS is not loaded."
        );

    }


    const templateParams = {

        /* Main variables */
        name:
            booking.name,

        email:
            booking.email,

        passcode:
            booking.verificationCode,

        time:
            "10 minutes",

        /* Additional common EmailJS variables */
        to_email:
            booking.email,

        to_name:
            booking.name,

        otp:
            booking.verificationCode,

        verification_code:
            booking.verificationCode

    };


    console.log(
        "Sending OTP to:",
        booking.email
    );


    console.log(
        "OTP template parameters:",
        templateParams
    );


    try {

        const response =
            await emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_OTP_TEMPLATE_ID,
                templateParams
            );


        console.log(
            "EMAILJS OTP SUCCESS:",
            response.status,
            response.text
        );


        return response;

    } catch (error) {

        console.error(
            "EMAILJS OTP ERROR:",
            error
        );


        throw error;

    }

}


/* =========================================================
   21. SEND CONFIRMATION EMAIL
========================================================= */

async function sendBookingConfirmationEmail(
    booking
) {

    if (
        typeof emailjs === "undefined"
    ) {

        throw new Error(
            "EmailJS is not loaded."
        );

    }


    const templateParams = {

        name:
            booking.name,

        email:
            booking.email,

        to_email:
            booking.email,

        to_name:
            booking.name,

        booking_id:
            booking.bookingId,

        movie:
            booking.movie,

        date:
            booking.date,

        show_time:
            booking.showTime,

        seats:
            booking.seats.join(", "),

        amount:
            `₹${booking.amount}`

    };


    console.log(
        "Sending confirmation email to:",
        booking.email
    );


    try {

        const response =
            await emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_CONFIRMATION_TEMPLATE_ID,
                templateParams
            );


        console.log(
            "EMAILJS CONFIRMATION SUCCESS:",
            response.status,
            response.text
        );


        return response;

    } catch (error) {

        console.error(
            "EMAILJS CONFIRMATION ERROR:",
            error
        );


        throw error;

    }

}


/* =========================================================
   22. OPEN VERIFICATION POPUP
========================================================= */

function openVerificationPopup() {

    const popup =
        document.getElementById(
            "verificationPopup"
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


    popup.style.display =
        "flex";


    if (input) {

        input.value = "";


        setTimeout(
            function () {

                input.focus();

            },
            100
        );

    }


    if (error) {

        error.textContent =
            "";

    }

}


/* =========================================================
   23. CLOSE VERIFICATION POPUP
========================================================= */

function closeVerificationPopup() {

    const popup =
        document.getElementById(
            "verificationPopup"
        );


    if (popup) {

        popup.style.display =
            "none";

    }

}


/* =========================================================
   24. CONFIRM BOOKING
========================================================= */

async function confirmBooking() {

    const nameInput =
        document.getElementById(
            "userName"
        );


    const emailInput =
        document.getElementById(
            "userEmail"
        );


    const movieSelect =
        document.getElementById(
            "movieSelect"
        );


    const dateInput =
        document.getElementById(
            "bookingDate"
        );


    const timeSelect =
        document.getElementById(
            "showTime"
        );


    const confirmButton =
        document.getElementById(
            "confirmBookingButton"
        );


    if (
        !nameInput ||
        !emailInput ||
        !movieSelect ||
        !dateInput ||
        !timeSelect
    ) {

        console.error(
            "Booking form elements are missing."
        );

        return;

    }


    const name =
        nameInput.value.trim();


    const email =
        emailInput.value.trim();


    const movie =
        movieSelect.value;


    const date =
        dateInput.value;


    const showTime =
        timeSelect.value;


    const seats =
        getSelectedSeats();


    /* -------------------------
       VALIDATION
    ------------------------- */

    if (!name) {

        alert(
            "Please enter your name."
        );

        nameInput.focus();

        return;

    }


    if (!email) {

        alert(
            "Please enter your Gmail address."
        );

        emailInput.focus();

        return;

    }


    if (!isValidGmail(email)) {

        alert(
            "Please enter a valid Gmail address.\nExample: example@gmail.com"
        );

        emailInput.focus();

        return;

    }


    if (!movie) {

        alert(
            "Please select a movie."
        );

        movieSelect.focus();

        return;

    }


    if (!date) {

        alert(
            "Please select a booking date."
        );

        dateInput.focus();

        return;

    }


    if (
        date <
        getTodayString()
    ) {

        alert(
            "Please select today or a future date."
        );

        return;

    }


    if (!showTime) {

        alert(
            "Please select a show time."
        );

        timeSelect.focus();

        return;

    }


    if (
        isPastShowTime(
            date,
            showTime
        )
    ) {

        alert(
            "This show time has already passed. Please select another time."
        );

        return;

    }


    if (seats.length === 0) {

        alert(
            "Please select at least one seat."
        );

        return;

    }


    if (
        seats.length >
        maxSeatsPerBooking
    ) {

        alert(
            `You can select maximum ${maxSeatsPerBooking} seats.`
        );

        return;

    }


    /* -------------------------
       CHECK OCCUPIED SEATS
    ------------------------- */

    const occupiedSeats =
        getOccupiedSeats();


    const alreadyOccupied =
        seats.filter(
            function (seat) {

                return occupiedSeats.includes(
                    seat
                );

            }
        );


    if (
        alreadyOccupied.length > 0
    ) {

        alert(
            "These seats are already occupied: " +
            alreadyOccupied.join(", ")
        );


        updateOccupiedSeats();

        return;

    }


    /* -------------------------
       CHECK EXISTING OTP
    ------------------------- */

    const existingPending =
        getPendingBooking();


    if (existingPending) {

        const age =
            Date.now() -
            existingPending.otpCreatedAt;


        if (
            age < OTP_VALIDITY
        ) {

            alert(
                "A verification code has already been sent to your Gmail. Please enter that code."
            );


            openVerificationPopup();

            return;

        } else {

            removePendingBooking();

        }

    }


    /* -------------------------
       CREATE BOOKING
    ------------------------- */

    const booking = {

        bookingId:
            generateBookingId(),

        name:
            name,

        email:
            email,

        movie:
            movie,

        date:
            date,

        showTime:
            showTime,

        seats:
            seats,

        amount:
            seats.length * ticketPrice,

        status:
            "pending",

        verificationCode:
            generateOTP(),

        otpCreatedAt:
            Date.now(),

        createdAt:
            Date.now()

    };


    saveUserDetails(
        name,
        email
    );


    savePendingBooking(
        booking
    );


    /* -------------------------
       DISABLE BUTTON
    ------------------------- */

    if (confirmButton) {

        confirmButton.disabled =
            true;


        confirmButton.textContent =
            "Sending OTP...";

    }


    try {

        await sendOTPEmail(
            booking
        );


        console.log(
            "OTP email sent successfully."
        );


        alert(
            "A 6-digit verification code has been sent to:\n" +
            email
        );


        openVerificationPopup();


    } catch (error) {

        console.error(
            "OTP sending failed:",
            error
        );


        removePendingBooking();


        alert(
            "OTP could not be sent.\n\n" +
            "Please check your EmailJS settings and try again."
        );

    } finally {

        if (confirmButton) {

            confirmButton.disabled =
                false;


            confirmButton.textContent =
                "Confirm Booking";

        }

    }

}


/* =========================================================
   25. VERIFY OTP
========================================================= */

async function verifyBookingCode() {

    const input =
        document.getElementById(
            "verificationInput"
        );


    const errorElement =
        document.getElementById(
            "verificationError"
        );


    const verifyButton =
        document.getElementById(
            "verifyBookingButton"
        );


    if (!input) {
        return;
    }


    const enteredCode =
        input.value.trim();


    if (
        !/^\d{6}$/.test(
            enteredCode
        )
    ) {

        if (errorElement) {

            errorElement.textContent =
                "Please enter the 6-digit OTP.";

        }

        return;

    }


    const pendingBooking =
        getPendingBooking();


    if (!pendingBooking) {

        if (errorElement) {

            errorElement.textContent =
                "No pending booking found. Please book again.";

        }

        return;

    }


    /* -------------------------
       OTP EXPIRY
    ------------------------- */

    const otpAge =
        Date.now() -
        pendingBooking.otpCreatedAt;


    if (
        otpAge >= OTP_VALIDITY
    ) {

        removePendingBooking();


        if (errorElement) {

            errorElement.textContent =
                "OTP has expired. Please book again.";

        }

        return;

    }


    /* -------------------------
       OTP CHECK
    ------------------------- */

    if (
        enteredCode !==
        pendingBooking.verificationCode
    ) {

        if (errorElement) {

            errorElement.textContent =
                "Incorrect OTP. Please try again.";

        }

        return;

    }


    /* -------------------------
       CHECK SEATS AGAIN
    ------------------------- */

    const occupiedSeats =
        getOccupiedSeats();


    const conflictingSeats =
        pendingBooking.seats.filter(
            function (seat) {

                return occupiedSeats.includes(
                    seat
                );

            }
        );


    if (
        conflictingSeats.length > 0
    ) {

        removePendingBooking();


        if (errorElement) {

            errorElement.textContent =
                "Sorry, these seats are already occupied: " +
                conflictingSeats.join(", ");

        }


        updateOccupiedSeats();

        return;

    }


    /* -------------------------
       DISABLE VERIFY BUTTON
    ------------------------- */

    if (verifyButton) {

        verifyButton.disabled =
            true;


        verifyButton.textContent =
            "Confirming...";

    }


    /* -------------------------
       CREATE CONFIRMED BOOKING
    ------------------------- */

    const confirmedBooking = {

        ...pendingBooking,

        status:
            "confirmed",

        confirmedAt:
            Date.now()

    };


    const bookings =
        getBookings();


    bookings.push(
        confirmedBooking
    );


    saveBookings(
        bookings
    );


    /* -------------------------
       SAVE FOR CONFIRMATION PAGE
    ------------------------- */

    localStorage.setItem(
        "bookingData",
        JSON.stringify(
            confirmedBooking
        )
    );


    removePendingBooking();


    /* -------------------------
       SEND CONFIRMATION EMAIL
    ------------------------- */

    try {

        await sendBookingConfirmationEmail(
            confirmedBooking
        );


        console.log(
            "Confirmation email sent."
        );

    } catch (error) {

        console.error(
            "Confirmation email failed:",
            error
        );

        /*
           Booking remains confirmed
           even if confirmation email fails.
        */

    }


    /* -------------------------
       CLOSE POPUP
    ------------------------- */

    closeVerificationPopup();


    /* -------------------------
       GO TO CONFIRMATION PAGE
    ------------------------- */

    window.location.href =
        "confirmation.html";

}


/* =========================================================
   26. OTP INPUT
========================================================= */

function setupOTPInput() {

    const input =
        document.getElementById(
            "verificationInput"
        );


    if (!input) {
        return;
    }


    input.addEventListener(
        "input",
        function () {

            input.value =
                input.value
                    .replace(
                        /\D/g,
                        ""
                    )
                    .slice(
                        0,
                        6
                    );

        }
    );


    input.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Enter"
            ) {

                verifyBookingCode();

            }

        }
    );

}


/* =========================================================
   27. LOAD CONFIRMATION DATA
========================================================= */

function loadConfirmationData() {

    const bookingData =
        localStorage.getItem(
            "bookingData"
        );


    if (!bookingData) {
        return;
    }


    let booking;


    try {

        booking =
            JSON.parse(
                bookingData
            );

    } catch (error) {

        console.error(
            "Invalid booking data:",
            error
        );

        return;

    }


    const fields = {

        confirmUserName:
            booking.name,

        confirmUserEmail:
            booking.email,

        confirmMovie:
            booking.movie,

        confirmDate:
            booking.date,

        confirmTime:
            booking.showTime,

        confirmSeats:
            Array.isArray(
                booking.seats
            )
                ? booking.seats.join(", ")
                : "",

        confirmAmount:
            `₹${booking.amount}`,

        bookingId:
            booking.bookingId

    };


    Object.keys(fields).forEach(
        function (id) {

            const element =
                document.getElementById(
                    id
                );


            if (element) {

                element.textContent =
                    fields[id];

            }

        }
    );

}


/* =========================================================
   28. CANCELLATION
========================================================= */

function canCancelBooking(booking) {

    if (!booking) {
        return false;
    }


    if (
        booking.status !==
        "confirmed"
    ) {

        return false;

    }


    if (!booking.confirmedAt) {
        return false;
    }


    const elapsed =
        Date.now() -
        booking.confirmedAt;


    return (
        elapsed <=
        CANCELLATION_LIMIT
    );

}


function cancelBooking(bookingId) {

    if (!bookingId) {
        return;
    }


    const bookings =
        getBookings();


    const bookingIndex =
        bookings.findIndex(
            function (booking) {

                return (
                    booking.bookingId ===
                    bookingId
                );

            }
        );


    if (
        bookingIndex === -1
    ) {

        alert(
            "Booking not found."
        );

        return;

    }


    const booking =
        bookings[bookingIndex];


    if (
        booking.status !==
        "confirmed"
    ) {

        alert(
            "This booking is already cancelled."
        );

        return;

    }


    if (
        !canCancelBooking(
            booking
        )
    ) {

        alert(
            "Cancellation is only available within 30 minutes of booking confirmation."
        );

        return;

    }


    const confirmed =
        confirm(
            "Are you sure you want to cancel this booking?"
        );


    if (!confirmed) {
        return;
    }


    bookings[bookingIndex] = {

        ...booking,

        status:
            "cancelled",

        cancelledAt:
            Date.now()

    };


    saveBookings(
        bookings
    );


    alert(
        "Your booking has been cancelled successfully."
    );


    loadBookingHistory();

    updateOccupiedSeats();

}


/* =========================================================
   29. BOOKING HISTORY
========================================================= */

function loadBookingHistory() {

    const container =
        document.getElementById(
            "bookingHistory"
        );


    if (!container) {
        return;
    }


    const bookings =
        getBookings();


    if (bookings.length === 0) {

        container.innerHTML =
            "<p>No booking history found.</p>";

        return;

    }


    container.innerHTML =
        "";


    bookings
        .slice()
        .reverse()
        .forEach(
            function (booking) {

                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "history-card";


                const status =
                    booking.status ===
                    "confirmed"

                        ? "Confirmed"

                        : "Cancelled";


                const statusClass =
                    booking.status ===
                    "confirmed"

                        ? "confirmed"

                        : "cancelled";


                let cancelButton =
                    "";


                if (
                    booking.status ===
                    "confirmed" &&
                    canCancelBooking(
                        booking
                    )
                ) {

                    cancelButton = `

                        <button
                            class="cancel-btn"
                            onclick="cancelBooking('${escapeHTML(booking.bookingId)}')"
                        >
                            Cancel Booking
                        </button>

                    `;

                }


                card.innerHTML = `

                    <div class="history-content">

                        <h3>
                            ${escapeHTML(
                                booking.movie
                            )}
                        </h3>

                        <p>
                            <strong>Booking ID:</strong>
                            ${escapeHTML(
                                booking.bookingId
                            )}
                        </p>

                        <p>
                            <strong>Name:</strong>
                            ${escapeHTML(
                                booking.name
                            )}
                        </p>

                        <p>
                            <strong>Email:</strong>
                            ${escapeHTML(
                                booking.email
                            )}
                        </p>

                        <p>
                            <strong>Date:</strong>
                            ${escapeHTML(
                                booking.date
                            )}
                        </p>

                        <p>
                            <strong>Time:</strong>
                            ${escapeHTML(
                                booking.showTime
                            )}
                        </p>

                        <p>
                            <strong>Seats:</strong>
                            ${escapeHTML(
                                Array.isArray(
                                    booking.seats
                                )
                                    ? booking.seats.join(", ")
                                    : ""
                            )}
                        </p>

                        <p>
                            <strong>Amount:</strong>
                            ₹${escapeHTML(
                                booking.amount
                            )}
                        </p>

                        <p>
                            <strong>Status:</strong>

                            <span class="status ${statusClass}">
                                ${status}
                            </span>

                        </p>

                        ${cancelButton}

                    </div>

                `;


                container.appendChild(
                    card
                );

            }
        );

}


/* =========================================================
   30. NAVIGATION
========================================================= */

function goHome() {

    window.location.href =
        "index.html";

}


function goToHistory() {

    window.location.href =
        "index.html#history";

}


/* =========================================================
   31. AUTO SELECT MOVIE FROM URL
========================================================= */

function selectMovieFromURL() {

    const movieSelect =
        document.getElementById(
            "movieSelect"
        );


    if (!movieSelect) {
        return;
    }


    const params =
        new URLSearchParams(
            window.location.search
        );


    const movie =
        params.get("movie");


    if (!movie) {
        return;
    }


    const decodedMovie =
        decodeURIComponent(
            movie
        );


    const matchingOption =
        Array.from(
            movieSelect.options
        ).find(
            function (option) {

                return (
                    option.value.toLowerCase() ===
                    decodedMovie.toLowerCase()
                );

            }
        );


    if (matchingOption) {

        movieSelect.value =
            matchingOption.value;

    }

}


/* =========================================================
   32. SETUP BOOKING PAGE
========================================================= */

function setupBookingPage() {

    const movieSelect =
        document.getElementById(
            "movieSelect"
        );


    const dateInput =
        document.getElementById(
            "bookingDate"
        );


    const timeSelect =
        document.getElementById(
            "showTime"
        );


    if (
        !movieSelect &&
        !dateInput &&
        !timeSelect
    ) {

        return;

    }


    loadUserDetails();

    setupBookingDate();

    selectMovieFromURL();

    updateShowTimes();

    updateOccupiedSeats();

    updateBookingSummary();


    if (movieSelect) {

        movieSelect.addEventListener(
            "change",
            function () {

                updateOccupiedSeats();

            }
        );

    }


    if (dateInput) {

        dateInput.addEventListener(
            "change",
            function () {

                updateShowTimes();

                updateOccupiedSeats();

            }
        );

    }


    if (timeSelect) {

        timeSelect.addEventListener(
            "change",
            function () {

                updateOccupiedSeats();

            }
        );

    }


    getAllSeats().forEach(
        function (seat) {

            seat.addEventListener(
                "click",
                function () {

                    handleSeatClick(
                        seat
                    );

                }
            );

        }
    );

}


/* =========================================================
   33. GENERAL PAGE SETUP
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        setupBookingPage();

        setupOTPInput();

        loadConfirmationData();

        loadBookingHistory();

        updateCarousel();

    }
);


/* =========================================================
   34. CLOSE POPUP WHEN CLICKING OUTSIDE
========================================================= */

document.addEventListener(
    "click",
    function (event) {

        const popup =
            document.getElementById(
                "verificationPopup"
            );


        if (!popup) {
            return;
        }


        if (
            event.target === popup
        ) {

            closeVerificationPopup();

        }

    }
);


/* =========================================================
   35. AUTO REFRESH SHOW TIMES
========================================================= */

setInterval(
    function () {

        const bookingDate =
            document.getElementById(
                "bookingDate"
            );


        const showTime =
            document.getElementById(
                "showTime"
            );


        if (
            bookingDate &&
            showTime
        ) {

            updateShowTimes();

        }

    },
    30000
);
