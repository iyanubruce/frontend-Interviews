import { useState } from 'react';

function format(number: number) {
  return String(Number(number.toFixed(4)));
}

export default function App() {
  const [celsius, setCelsius] = useState('');
  const [fahrenheit, setFahrenheit] = useState('');

  function convert(
    value: string,
    setDestination: (value: string) => void,
    calculateValue: (value: number) => number,
  ) {
    if (value.trim() === '') {
      setDestination('');
      return;
    }

    const numericValue = Number(value);
    const result = calculateValue(numericValue);
    setDestination(
      Number.isFinite(numericValue) && Number.isFinite(result)
        ? format(result)
        : '',
    );
  }

  return (
    <div>
      <div className="temperature-converter">
        {/* Use a label for better a11y. */}
        <label className="temperature-converter-column">
          <input
            className="temperature-converter-column-top-row"
            inputMode="decimal"
            type="text"
            value={celsius}
            onChange={(event) => {
              const newValue = event.target.value;
              setCelsius(newValue);
              convert(newValue, setFahrenheit, (value) => (value * 9) / 5 + 32);
            }}
          />
          <div className="temperature-converter-column-bottom-row">Celsius</div>
        </label>
        <div className="temperature-converter-column">
          <div className="temperature-converter-column-top-row">=</div>
        </div>
        {/* Use a label for better a11y. */}
        <label className="temperature-converter-column">
          <input
            className="temperature-converter-column-top-row"
            inputMode="decimal"
            type="text"
            value={fahrenheit}
            onChange={(event) => {
              const newValue = event.target.value;
              setFahrenheit(newValue);
              convert(newValue, setCelsius, (value) => ((value - 32) * 5) / 9);
            }}
          />
          <div className="temperature-converter-column-bottom-row">
            Fahrenheit
          </div>
        </label>
      </div>
    </div>
  );
}
