import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  hours!: number;
  minutes!: number;
  seconds!: number;
  dateTimeDisplay!: string;
  intervalId!: number;

  ngOnInit(): void {
    this.updateTime();
    this.intervalId = window.setInterval(() => this.updateTime(), 100);
  }

  // Clear the timer upon destroy.
  ngOnDestroy(): void {
    window.clearInterval(this.intervalId);
  }

  private updateTime(): void {
    const date = new Date();
    const hours24 = date.getHours();
    this.hours = hours24 % 12 || 12;
    this.minutes = date.getMinutes();
    this.seconds = date.getSeconds();
    this.dateTimeDisplay = `${this.padTwoDigit(
      hours24,
    )}:${this.padTwoDigit(this.minutes)}:${this.padTwoDigit(this.seconds)}`;
  }

  private padTwoDigit(number: number): string {
    return number >= 10 ? String(number) : `0${number}`;
  }
}
