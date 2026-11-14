import { useState } from 'react';

export default function App() {
  const [monthlyPayment, setMonthlyPayment] = useState('');
  const [totalPayment, setTotalPayment] = useState('');
  const [totalInterest, setTotalInterest] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); // Prevent page reload on form submission.

    const data = new FormData(event.currentTarget);

    // Get and convert input values.
    const loanAmount = Number(data.get('loan-amount'));
    const annualInterestRate = Number(data.get('interest-rate'));
    const loanTermInYears = Number(data.get('loan-term'));

    if (
      ![loanAmount, annualInterestRate, loanTermInYears].every(
        (value) => Number.isFinite(value) && value > 0,
      )
    ) {
      setMonthlyPayment('');
      setTotalPayment('');
      setTotalInterest('');
      setErrorMessage('Enter finite positive values for all fields.');
      return;
    }

    const monthlyInterestRate = annualInterestRate / 100 / 12;
    const loanTermInMonths = loanTermInYears * 12;

    // Calculate monthly mortgage payment.
    const monthlyPaymentAmount =
      (loanAmount * monthlyInterestRate) /
      (1 - 1 / Math.pow(1 + monthlyInterestRate, loanTermInMonths));
    const totalPayment = monthlyPaymentAmount * loanTermInMonths;

    if (
      ![monthlyPaymentAmount, totalPayment].every((value) =>
        Number.isFinite(value),
      )
    ) {
      setMonthlyPayment('');
      setTotalPayment('');
      setTotalInterest('');
      setErrorMessage('Unable to calculate a finite mortgage result.');
      return;
    }

    setErrorMessage('');

    const currencyFormatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });

    // Display monthly payment amount.
    setMonthlyPayment(currencyFormatter.format(monthlyPaymentAmount));

    // Display total payment amount.
    setTotalPayment(currencyFormatter.format(totalPayment));

    // Display total interest amount.
    setTotalInterest(currencyFormatter.format(totalPayment - loanAmount));
  }

  return (
    <div className="mortgage-calculator">
      <form className="mortgage-calculator-form" onSubmit={onSubmit}>
        <div>
          <label>
            Loan Amount:{' '}
            <input
              type="number"
              name="loan-amount"
              defaultValue="100000"
              min="0"
              step="any"
              required
            />
          </label>
        </div>
        <div>
          <label>
            Loan Term (years):{' '}
            <input
              type="number"
              name="loan-term"
              defaultValue="30"
              min="0"
              step="any"
              required
            />
          </label>
        </div>
        <div>
          <label>
            Interest Rate (%):{' '}
            <input
              type="number"
              name="interest-rate"
              defaultValue="3"
              min="0"
              step="any"
              required
            />
          </label>
        </div>
        <div>
          <button type="submit">Calculate</button>
        </div>
      </form>
      <hr />
      <div aria-live="polite" className="mortgage-calculator-results">
        {errorMessage && <div>{errorMessage}</div>}
        <div>
          Monthly Payment Amount: <strong>{monthlyPayment}</strong>
        </div>
        <div>
          Total Payment Amount: <strong>{totalPayment}</strong>
        </div>
        <div>
          Total Interest Paid: <strong>{totalInterest}</strong>
        </div>
      </div>
    </div>
  );
}
