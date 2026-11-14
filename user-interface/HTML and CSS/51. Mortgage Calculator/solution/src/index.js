import './styles.css';

(() => {
  // Save a reference to form inputs.
  const $formEl = document.querySelector('.mortgage-calculator-form');
  const $monthlyPaymentEl = document.querySelector('#monthly-payment');
  const $totalPaymentEl = document.querySelector('#total-payment');
  const $totalInterestEl = document.querySelector('#total-interest');
  const $errorMessageEl = document.querySelector('#error-message');

  function clearResults() {
    $monthlyPaymentEl.textContent = '';
    $totalPaymentEl.textContent = '';
    $totalInterestEl.textContent = '';
  }

  // Listen to form submission.
  $formEl.addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent page reload on form submission.

    const data = new FormData(event.target);

    // Get and convert input values.
    const loanAmount = Number(data.get('loan-amount'));
    const annualInterestRate = Number(data.get('interest-rate'));
    const loanTermInYears = Number(data.get('loan-term'));

    if (
      ![loanAmount, annualInterestRate, loanTermInYears].every(
        (value) => Number.isFinite(value) && value > 0,
      )
    ) {
      clearResults();
      $errorMessageEl.textContent =
        'Enter finite positive values for all fields.';
      return;
    }

    const monthlyInterestRate = annualInterestRate / 100 / 12;
    const loanTermInMonths = loanTermInYears * 12;

    // Calculate monthly mortgage payment.
    const monthlyPayment =
      (loanAmount * monthlyInterestRate) /
      (1 - 1 / Math.pow(1 + monthlyInterestRate, loanTermInMonths));

    // Calculate total payment amount.
    const totalPayment = monthlyPayment * loanTermInMonths;

    // Calculate total interest paid.
    const totalInterest = totalPayment - loanAmount;

    if (![monthlyPayment, totalPayment, totalInterest].every(Number.isFinite)) {
      clearResults();
      $errorMessageEl.textContent =
        'Unable to calculate a finite mortgage result.';
      return;
    }

    $errorMessageEl.textContent = '';

    const currencyFormatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });

    // Set output values.
    $monthlyPaymentEl.textContent = currencyFormatter.format(monthlyPayment);
    $totalPaymentEl.textContent = currencyFormatter.format(totalPayment);
    $totalInterestEl.textContent = currencyFormatter.format(totalInterest);
  });
})();
