import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  celsius: string = '';
  fahrenheit: string = '';

  format(number: number): string {
    return String(Number(number.toFixed(4)));
  }

  convert(
    value: string,
    setDestination: (val: string) => void,
    calculateValue: (val: number) => number,
  ): void {
    if (value.trim() === '') {
      setDestination('');
      return;
    }

    const numericValue = Number(value);
    const result = calculateValue(numericValue);
    setDestination(
      Number.isFinite(numericValue) && Number.isFinite(result)
        ? this.format(result)
        : '',
    );
  }

  setCelsius(newValue: string) {
    this.celsius = newValue;
    this.convert(
      newValue,
      (val) => (this.fahrenheit = val),
      (value) => (value * 9) / 5 + 32,
    );
  }

  setFahrenheit(newValue: string) {
    this.fahrenheit = newValue;
    this.convert(
      newValue,
      (val) => (this.celsius = val),
      (value) => ((value - 32) * 5) / 9,
    );
  }
}
