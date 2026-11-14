import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, OnDestroy {
  timer!: number;
  size = 300;
  hours!: number;
  minutes!: number;
  seconds!: number;

  ngOnInit(): void {
    this.updateTime();
    this.timer = setInterval(() => this.updateTime(), 100);
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }

  private updateTime(): void {
    const date = new Date();
    this.hours = date.getHours();
    this.minutes = date.getMinutes();
    this.seconds = date.getSeconds();
  }
}
