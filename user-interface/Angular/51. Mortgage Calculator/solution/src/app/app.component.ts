import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormState } from './models/form-state.model';
import { Mortgage } from './models/mortgage.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  mortgage: Mortgage | null = null;
  errorMessage = '';

  formSubmit(mortgageData: FormState): void {
    const loanAmount = mortgageData.loanAmount;
    const annualInterestRate = mortgageData.interestRate;
    const loanTermInYears = mortgageData.loanTerm;

    if (
      ![loanAmount, annualInterestRate, loanTermInYears].every(
        (value) => Number.isFinite(value) && value > 0,
      )
    ) {
      this.mortgage = null;
      this.errorMessage = 'Enter finite positive values for all fields.';
      return;
    }

    const monthlyInterestRate = annualInterestRate / 100 / 12;
    const loanTermInMonths = loanTermInYears * 12;

    const monthlyPaymentAmount =
      (loanAmount * monthlyInterestRate) /
      (1 - Math.pow(1 + monthlyInterestRate, -loanTermInMonths));

    const totalPayment = monthlyPaymentAmount * loanTermInMonths;

    if (![monthlyPaymentAmount, totalPayment].every(Number.isFinite)) {
      this.mortgage = null;
      this.errorMessage = 'Unable to calculate a finite mortgage result.';
      return;
    }

    const currencyFormatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });

    this.errorMessage = '';
    this.mortgage = {
      monthlyPayment: currencyFormatter.format(monthlyPaymentAmount),
      totalPayment: currencyFormatter.format(totalPayment),
      totalInterest: currencyFormatter.format(totalPayment - loanAmount),
    };
  }
}
