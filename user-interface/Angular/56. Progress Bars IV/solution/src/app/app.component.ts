import { Component, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="wrapper">
      <div class="buttons">
        <button type="button" (click)="appendBar()">Add</button>
        <button type="button" (click)="toggle()">
          {{ isProgressing ? 'Pause' : 'Start' }}
        </button>
        <button type="button" (click)="reset()">Reset</button>
      </div>
      <div class="bars">
        <div
          *ngFor="let progress of progression; let index = index"
          class="bar"
          role="progressbar"
          aria-valuemin="0"
          aria-valuemax="100"
          [attr.aria-valuenow]="floor(progress)">
          <div
            class="bar__fill"
            [style.transform]="'scaleX(' + progress / 100 + ')'"></div>
        </div>
      </div>
    </div>
  `,
})
export class AppComponent implements OnDestroy {
  readonly concurrencyLimit = 3;
  progression = [0];
  timerId: number | null = null;
  readonly floor = Math.floor;
  isProgressing = false;

  start(): void {
    this.isProgressing = true;
    this.startTimer();
  }

  startTimer(): void {
    if (this.timerId != null) return;
    if (this.progression.every((value) => value >= 100)) return;

    this.timerId = window.setInterval(() => {
      const unfinished = this.progression
        .map((value, index) => ({ value, index }))
        .filter(({ value }) => value < 100)
        .slice(0, this.concurrencyLimit);

      if (unfinished.length === 0) {
        this.stopTimer();
        return;
      }

      const next = this.progression.slice();
      unfinished.forEach(({ index }) => {
        next[index] = Math.min(100, next[index] + 0.5);
      });
      this.progression = next;
    }, 10);
  }

  stopTimer(): void {
    if (this.timerId != null) window.clearInterval(this.timerId);
    this.timerId = null;
  }

  pause(): void {
    this.isProgressing = false;
    this.stopTimer();
  }

  toggle(): void {
    this.isProgressing ? this.pause() : this.start();
  }

  appendBar(): void {
    this.progression = [...this.progression, 0];
    if (this.isProgressing) this.startTimer();
  }

  reset(): void {
    this.pause();
    this.progression = [0];
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }
}
