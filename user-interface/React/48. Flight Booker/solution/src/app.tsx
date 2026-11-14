import { useState } from 'react';

const TODAY = formatDate(new Date());

function getTomorrow() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return formatDate(tomorrow);
}

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  return [year, month, day].join('-');
}

export default function App() {
  const [flightOption, setFlightOption] = useState('one-way');
  const [departureDate, setDepartureDate] = useState(getTomorrow);
  const [returnDate, setReturnDate] = useState(departureDate);

  function submitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (flightOption === 'one-way') {
      alert(`You have booked a one-way flight on ${departureDate}`);
      return;
    }

    alert(
      `You have booked a round-trip flight, departing on ${departureDate} and returning on ${returnDate}`,
    );
  }

  return (
    <div>
      <form className="flight-booker" onSubmit={submitForm}>
        <label htmlFor="flight-option">Flight type</label>
        <select
          id="flight-option"
          value={flightOption}
          onChange={(event) => {
            setFlightOption(event.target.value);
          }}>
          <option value="one-way">One-way flight</option>
          <option value="round-trip">Round-trip flight</option>
        </select>
        <label htmlFor="departure-date">Departure date</label>
        <input
          id="departure-date"
          type="date"
          required
          value={departureDate}
          onChange={(event) => {
            const nextDepartureDate = event.target.value;
            setDepartureDate(nextDepartureDate);
            setReturnDate((currentReturnDate) =>
              currentReturnDate < nextDepartureDate
                ? nextDepartureDate
                : currentReturnDate,
            );
          }}
          min={TODAY}
        />
        {flightOption === 'round-trip' && (
          <>
            <label htmlFor="return-date">Return date</label>
            <input
              id="return-date"
              type="date"
              required
              value={returnDate}
              min={departureDate}
              onChange={(event) => {
                setReturnDate(event.target.value);
              }}
            />
          </>
        )}
        <button>Book</button>
      </form>
    </div>
  );
}
