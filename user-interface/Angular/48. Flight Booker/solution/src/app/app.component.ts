import { ChangeDetectionStrategy, Component } from '@angular/core';

type FlightOption = 'one-way' | 'round-trip';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  readonly TODAY: string = this.formatDate(new Date());

  flightOption: FlightOption = 'one-way';
  departureDate: string = this.getTomorrow();
  returnDate: string = this.departureDate;

  onSubmit() {
    if (this.flightOption === 'one-way') {
      alert(`You have booked a one-way flight on ${this.departureDate}`);
      return;
    }

    alert(
      `You have booked a round-trip flight, departing on ${this.departureDate} and returning on ${this.returnDate}`,
    );
  }

  onDepartureChange(departureDate: string) {
    this.departureDate = departureDate;
    if (this.returnDate < departureDate) {
      this.returnDate = departureDate;
    }
  }

  private getTomorrow(): string {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return this.formatDate(tomorrow);
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return [year, month, day].join('-');
  }
}
