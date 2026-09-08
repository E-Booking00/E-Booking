let currentSlide = 0;

const track = document.querySelector(".carousel-track");
const dots = document.querySelectorAll(".dot");


/* =========================
   CAROUSEL
========================= */

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
    );

    const cardWidth =
        cards[0].offsetWidth + gap;

    track.style.transform =
        "translateX(-" +
        (currentSlide * cardWidth) +
        "px)";


    dots.forEach(function(dot, index) {

        dot.classList.remove("active");

        if (index === currentSlide) {
            dot.classList.add("active");
        }

    });
}


/* AUTOMATIC SLIDE */

if (track) {

    setInterval(function() {

        moveCarousel(1);

    }, 4000);

}


/* =========================
   BOOK MOVIE
========================= */

function bookMovie(movieName) {

    window.location.href =
        "booking.html?movie=" +
        encodeURIComponent(movieName);

}


/* =========================
   AUTO SELECT MOVIE
========================= */

const urlParams =
    new URLSearchParams(window.location.search);

const selectedMovie =
    urlParams.get("movie");

const movieSelect =
    document.getElementById("movieSelect");


if (selectedMovie && movieSelect) {

    movieSelect.value = selectedMovie;

}


/* =========================
   TICKET PRICE
========================= */

const ticketPrice = 150;


/* =========================
   SEAT SELECTION
========================= */

const seats =
    document.querySelectorAll(".seat:not(.occupied)");


seats.forEach(function(seat) {

    seat.addEventListener("click", function() {

        seat.classList.toggle("selected");

        updateBookingSummary();

    });

});


/* =========================
   BOOKING SUMMARY
========================= */

function updateBookingSummary() {

    const selectedSeats =
        document.querySelectorAll(".seat.selected");

    const seatCount =
        selectedSeats.length;

    const totalAmount =
        seatCount * ticketPrice;


    const selectedSeatsElement =
        document.getElementById("selectedSeats");

    const ticketPriceElement =
        document.getElementById("ticketPrice");

    const totalAmountElement =
        document.getElementById("totalAmount");


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


/* =========================
   CONFIRM BOOKING
========================= */

function confirmBooking() {

    const movie =
        document.getElementById("movieSelect").value;

    const date =
        document.getElementById("bookingDate").value;

    const time =
        document.getElementById("showTime").value;


    const selectedSeats =
        document.querySelectorAll(".seat.selected");


    /* CHECK MOVIE */

    if (movie === "") {

        alert("Please select a movie.");

        return;

    }


    /* CHECK DATE */

    if (date === "") {

        alert("Please select a date.");

        return;

    }


    /* CHECK TIME */

    if (time === "") {

        alert("Please select a show time.");

        return;

    }


    /* CHECK SEATS */

    if (selectedSeats.length === 0) {

        alert("Please select at least one seat.");

        return;

    }


    /* GET SEAT NAMES */

    const seatNames = [];


    selectedSeats.forEach(function(seat) {

        seatNames.push(
            seat.textContent
        );

    });


    /* CALCULATE TOTAL */

    const totalAmount =
        selectedSeats.length * ticketPrice;


    /* SAVE BOOKING */

    const bookingData = {

        movie: movie,

        date: date,

        time: time,

        seats: seatNames.join(", "),

        amount: totalAmount

    };


    localStorage.setItem(
        "bookingData",
        JSON.stringify(bookingData)
    );


    /* OPEN CONFIRMATION PAGE */

    window.location.href =
        "confirmation.html";

}


/* =========================
   LOAD CONFIRMATION DATA
========================= */

if (document.getElementById("confirmMovie")) {

    const savedBooking =
        localStorage.getItem("bookingData");


    if (savedBooking) {

        const booking =
            JSON.parse(savedBooking);


        const confirmMovie =
            document.getElementById("confirmMovie");

        const confirmDate =
            document.getElementById("confirmDate");

        const confirmTime =
            document.getElementById("confirmTime");

        const confirmSeats =
            document.getElementById("confirmSeats");

        const confirmAmount =
            document.getElementById("confirmAmount");


        if (confirmMovie) {

            confirmMovie.textContent =
                booking.movie;

        }


        if (confirmDate) {

            confirmDate.textContent =
                booking.date;

        }


        if (confirmTime) {

            confirmTime.textContent =
                booking.time;

        }


        if (confirmSeats) {

            confirmSeats.textContent =
                booking.seats;

        }


        if (confirmAmount) {

            confirmAmount.textContent =
                booking.amount;

        }

    }

}