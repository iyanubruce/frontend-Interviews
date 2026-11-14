import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="wrapper">
      <div *ngFor="let value of values" class="progress">
        <div
          class="progress-bar"
          [style.width.%]="clamp(value)"
          role="progressbar"
          [attr.aria-valuenow]="clamp(value)"
          [attr.aria-valuemin]="min"
          [attr.aria-valuemax]="max">
          {{ clamp(value) }}%
        </div>
      </div>
    </div>
  `,
})
export class AppComponent {
  readonly min = 0;
  readonly max = 100;
  readonly values = [0, 25, 50, 75, 100, 2, -10, 120];

  clamp(value: number): number {
    return Math.min(Math.max(value, this.min), this.max);
  }
}
