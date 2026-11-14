import './styles.css';

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
const today = formatDate(new Date());
const tomorrowDate = new Date();
tomorrowDate.setDate(tomorrowDate.getDate() + 1);
const tomorrow = formatDate(tomorrowDate);
const form = document.querySelector('form');
const type = form.elements['flight-type'];
const departure = form.elements.departure;
const returnDate = form.elements.return;
const returnDateField = document.querySelector('#return-date-field');

departure.min = today;
departure.value = tomorrow;
returnDate.value = tomorrow;
returnDate.min = tomorrow;

type.addEventListener('change', () => {
  const roundTrip = type.value === 'round-trip';
  returnDateField.hidden = !roundTrip;
  returnDate.disabled = !roundTrip;
});

departure.addEventListener('change', () => {
  returnDate.min = departure.value;
  if (returnDate.value < departure.value) returnDate.value = departure.value;
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (type.value === 'one-way') {
    alert(`You have booked a one-way flight on ${departure.value}`);
  } else {
    alert(
      `You have booked a round-trip flight, departing on ${departure.value} and returning on ${returnDate.value}`,
    );
  }
});
type.dispatchEvent(new Event('change'));
