"use strict"; // Use strict JavaScript mode

// Hotel information
const hotels = [
  {
    name: "Хотел Яев",
    price: 75,
  },
  {
    name: "Хотел Central",
    price: 90,
  },
  {
    name: "Lux Apart",
    price: 120,
  },
  {
    name: "Хотел Алмонд",
    price: 85,
  },
];

////////////////////////////////////////////// VARIABLES //////////////////////////////////////////////
// Reservation form elements
const fullNameInput = document.getElementById("fullName");
const arrivalDateInput = document.getElementById("arrivalDate");
const departureDateInput = document.getElementById("departureDate");
const nightsInput = document.getElementById("nights");
const guestsInput = document.getElementById("guests");
const roomTypeSelect = document.getElementById("roomType");
const priceInput = document.getElementById("price");
const selectHotel = document.getElementById("selectHotel");

// Payment form elements
const cardNumberInput = document.getElementById("cardNumber");
const cardExpirationInput = document.getElementById("cardExpiration");

// Year footer element
const yearFooter = document.querySelector(".year");

// Add event listeners to the reservation form elements
fullNameInput.addEventListener("change", updateForm);
arrivalDateInput.addEventListener("change", setDates);
departureDateInput.addEventListener("change", updateForm);
guestsInput.addEventListener("change", updateForm);
roomTypeSelect.addEventListener("change", updateForm);
selectHotel.addEventListener("change", updateForm);

// Add event listeners to the payment form elements
cardNumberInput.addEventListener("input", validateCardNumber);
cardNumberInput.addEventListener("input", function (event) {
  formatInput(event, 4, " ", 19); // Use 4 as the pattern for spaces
});
cardExpirationInput.addEventListener("input", validateCardExpiration);
cardExpirationInput.addEventListener("input", function (event) {
  formatInput(event, 2, "/", 5); // Use 2 as the pattern for slashes
});

// Set the minimum arrival date to today
arrivalDateInput.min = new Date().toISOString().split("T")[0];

// Set the year in the footer
yearFooter.textContent = new Date().getFullYear();

//////////////////////////////////////////////// FUNCTIONS ////////////////////////////////////////////////
// Update the form
function updateForm() {
  // Get the form values
  const fullName = fullNameInput.value;
  const arrivalDate = parseDate(arrivalDateInput.value);
  const departureDate = parseDate(departureDateInput.value);
  const selectedGuests = parseInt(guestsInput.value);
  const selectedRoomType = roomTypeSelect.value;
  const selectedHotel = selectHotel.value;

  // Form summary elements
  const summaryFullName = document.querySelector(".summary-fullName");
  const summaryHotel = document.querySelector(".summary-hotel");
  const summaryArrival = document.querySelector(".summary-arrival");
  const summaryDeparture = document.querySelector(".summary-departure");
  const summaryRoomType = document.querySelector(".summary-room-type");
  const summaryGuests = document.querySelector(".summary-guests");
  const summaryPrice = document.querySelector(".summary-price");

  // If the arrival date is not valid, reset the form
  if (!isDateValid(departureDate)) {
    nightsInput.value = "";
    priceInput.value = "";
    return;
  }

  // Set the arrival and departure dates
  setDates();

  // Calculate the number of nights and the total price
  const nights = calculateNights(arrivalDate, departureDate);
  const totalPrice = calculateTotalPrice(
    selectedHotel,
    selectedRoomType,
    nights,
    selectedGuests
  );

  // Update form values
  nightsInput.value = nights;
  priceInput.value = totalPrice;

  // Update the form summary
  summaryFullName.textContent = fullName;
  summaryHotel.textContent = selectedHotel;
  summaryArrival.textContent = arrivalDateInput.value;
  summaryDeparture.textContent = departureDateInput.value;
  summaryRoomType.textContent = selectedRoomType;
  summaryGuests.textContent = selectedGuests;
  summaryPrice.textContent = totalPrice;

  submitReservationForm();
}

function submitReservationForm() {
  const reservationForm = document.querySelector(".reservation-form");
  const paymentForm = document.querySelector(".payment-form");
  const formSummary = document.querySelector(".form-summary");
  const formDisclaimer = document.querySelector(".form-disclaimer");

  reservationForm.addEventListener("submit", (e) => {
    e.preventDefault();

    paymentForm.style = "display: grid";
    formSummary.style = "display: block";
    formDisclaimer.style = "display: block";
    reservationForm.style = "display: none";
  });
}

function parseDate(dateString) {
  return new Date(dateString);
}

// Set the minimum departure date to the next day
function setDates() {
  const arrivalDateValue = arrivalDateInput.value;
  const arrivalDate = parseDate(arrivalDateValue);

  // First set the minimum arrival date to today
  arrivalDateInput.min = new Date().toISOString().split("T")[0];

  if (!isDateValid(arrivalDate)) {
    // Reset the form if the arrival date is not valid
    resetForm();
    return;
  }

  const minDepartureDate = new Date(arrivalDate);
  minDepartureDate.setDate(minDepartureDate.getDate() + 1);

  // Ensure that the minDepartureDate is valid
  if (isDateValid(minDepartureDate)) {
    departureDateInput.min = minDepartureDate.toISOString().split("T")[0];
  }
}

function isDateValid(date) {
  // Check if the date is valid and if it is in the future
  return !isNaN(date) && date >= new Date();
}

function calculateNights(arrivalDate, departureDate) {
  const timeDiff = departureDate - arrivalDate;
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
}

function calculateTotalPrice(
  selectedHotel,
  selectedRoomType,
  nights,
  selectedGuests
) {
  // Find the selected hotel
  const hotel = hotels.find((hotel) => hotel.name === selectedHotel);

  if (!hotel) {
    return 0; // Handle the case where the selected hotel is not found
  }

  // Calculate the total price
  const basePrice = hotel.price;
  let totalPrice = basePrice * nights;

  if (selectedRoomType === "Premium") {
    // Add 20% for premium rooms
    totalPrice *= 1.2;
  }

  return totalPrice * selectedGuests;
}

function resetForm() {
  nightsInput.value = "";
  priceInput.value = "";
}

// Function to format input with spaces or slashes
function formatInput(event, pattern, separator, maxLength) {
  let input = event.target;
  let value = input.value.replace(/\D/g, ""); // Remove non-numeric characters
  let formattedValue = "";

  for (let i = 0; i < value.length; i++) {
    if (i > 0 && i % pattern === 0) {
      formattedValue += separator; // Add separator every specified number of characters
    }
    formattedValue += value[i];
  }

  input.value = formattedValue.slice(0, maxLength);
}

// Function to validate the card number
function validateCardNumber() {
  let cardNumberValue = cardNumberInput.value.replace(/\s/g, ""); // Remove spaces

  if (!/^\d{16}$/.test(cardNumberValue)) {
    cardNumberInput.setCustomValidity(
      "Please enter a valid 16-digit card number."
    );
  } else {
    cardNumberInput.setCustomValidity("");
  }
}

// Function to validate the card expiration
function validateCardExpiration() {
  let cardExpirationValue = cardExpirationInput.value;

  if (!/^\d{2}\/\d{2}$/.test(cardExpirationValue)) {
    cardExpirationInput.setCustomValidity(
      "Please enter a valid MM/YY date format."
    );
  } else {
    let [month, year] = cardExpirationValue.split("/");
    let currentYear = new Date().getFullYear() % 100; // Get last two digits of the current year

    if (
      parseInt(month) < 1 ||
      parseInt(month) > 12 ||
      parseInt(year) < currentYear
    ) {
      cardExpirationInput.setCustomValidity(
        "Please enter a valid expiration date."
      );
    } else {
      cardExpirationInput.setCustomValidity("");
    }
  }
}

// Initialize on page load
updateForm();
