// Set the minimum arrival date to today
document.getElementById("arrivalDate").min = new Date()
  .toISOString()
  .split("T")[0];

// Hotel information
const hotels = [
  {
    name: "hotel-yaev",
    price: 75,
  },
  {
    name: "hotel-central",
    price: 90,
  },
  {
    name: "lux-apart",
    price: 120,
  },
  {
    name: "hotel-almond",
    price: 85,
  },
];

// Reservation form elements
const arrivalDateInput = document.getElementById("arrivalDate");
const departureDateInput = document.getElementById("departureDate");
const nightsInput = document.getElementById("nights");
const guestsInput = document.getElementById("guests");
const roomTypeSelect = document.getElementById("roomType");
const priceInput = document.getElementById("price");
const selectHotel = document.getElementById("selectHotel");

// Update the number of nights and the total price
arrivalDateInput.addEventListener("change", setDates);
departureDateInput.addEventListener("change", updateForm);
guestsInput.addEventListener("change", updateForm);
roomTypeSelect.addEventListener("change", updateForm);
selectHotel.addEventListener("change", updateForm);

// Update the form
function updateForm() {
  const arrivalDate = parseDate(arrivalDateInput.value);
  const departureDate = parseDate(departureDateInput.value);
  const selectedGuests = parseInt(guestsInput.value);
  const selectedRoomType = roomTypeSelect.value;
  const selectedHotel = selectHotel.value;

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

  nightsInput.value = nights;
  priceInput.value = totalPrice;
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

  if (selectedRoomType === "premium") {
    // Add 20% for premium rooms
    totalPrice *= 1.2;
  }

  return totalPrice * selectedGuests;
}

function resetForm() {
  nightsInput.value = "";
  priceInput.value = "";
}

// Initialize on page load
updateForm();
