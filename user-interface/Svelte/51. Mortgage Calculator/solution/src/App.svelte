<script>

  let monthlyPayment = '';
  let totalPayment = '';
  let totalInterest = '';
  let errorMessage = '';

  function onSubmit(event) {
    event.preventDefault(); // Prevent page reload on form submission.

    const data = new FormData(event.target);

    // Get and convert input values.
    const loanAmount = Number(data.get('loan-amount'));
    const annualInterestRate = Number(
      data.get('interest-rate'),
    );
    const loanTermInYears = Number(data.get('loan-term'));

    if (
      ![loanAmount, annualInterestRate, loanTermInYears].every(
        (value) => Number.isFinite(value) && value > 0,
      )
    ) {
      monthlyPayment = '';
      totalPayment = '';
      totalInterest = '';
      errorMessage =
        'Enter finite positive values for all fields.';
      return;
    }

    const monthlyInterestRate =
      annualInterestRate / 100 / 12;
    const loanTermInMonths = loanTermInYears * 12;

    // Calculate monthly mortgage payment.
    const monthlyPaymentAmount =
      (loanAmount * monthlyInterestRate) /
      (1 -
        1 /
          Math.pow(
            1 + monthlyInterestRate,
            loanTermInMonths,
          ));
    const totalPaymentAmount =
      monthlyPaymentAmount * loanTermInMonths;

    if (
      ![monthlyPaymentAmount, totalPaymentAmount].every(
        Number.isFinite,
      )
    ) {
      monthlyPayment = '';
      totalPayment = '';
      totalInterest = '';
      errorMessage =
        'Unable to calculate a finite mortgage result.';
      return;
    }

    errorMessage = '';

    const currencyFormatter = new Intl.NumberFormat(
      'en-US',
      {
        style: 'currency',
        currency: 'USD',
      },
    );

    // Display monthly payment amount.
    monthlyPayment = currencyFormatter.format(
      monthlyPaymentAmount,
    );
    // Display total payment amount.
    totalPayment = currencyFormatter.format(
      totalPaymentAmount,
    );
    // Display total interest amount.
    totalInterest = currencyFormatter.format(
      totalPaymentAmount - loanAmount,
    );
  }
</script>

<div class="mortgage-calculator">
  <form
    class="mortgage-calculator-form"
    on:submit={onSubmit}>
    <div>
      <label>
        {'Loan Amount: '}
        <input
          type="number"
          name="loan-amount"
          defaultValue="100000"
          min="0"
          step="any"
          required />
      </label>
    </div>
    <div>
      <label>
        {'Loan Term (years): '}
        <input
          type="number"
          name="loan-term"
          defaultValue="30"
          min="0"
          step="any"
          required />
      </label>
    </div>
    <div>
      <label>
        {'Interest Rate (%): '}
        <input
          type="number"
          name="interest-rate"
          defaultValue="3"
          min="0"
          step="any"
          required />
      </label>
    </div>
    <div>
      <button type="submit">Calculate</button>
    </div>
  </form>
  <hr />
  <div
    aria-live="polite"
    class="mortgage-calculator-results">
    {#if errorMessage}
      <div>{errorMessage}</div>
    {/if}
    <div>
      {'Monthly Payment Amount: '}
      <strong>{monthlyPayment}</strong>
    </div>
    <div>
      {'Total Payment Amount: '}
      <strong>{totalPayment}</strong>
    </div>
    <div>
      {'Total Interest Paid: '}
      <strong>{totalInterest}</strong>
    </div>
  </div>
</div>

<style>
  .mortgage-calculator {
    display: flex;
    flex-direction: column;
    font-size: 14px;
    gap: 12px;
  }

  .mortgage-calculator-form {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .mortgage-calculator-results {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
</style>
