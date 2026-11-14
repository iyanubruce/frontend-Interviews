import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  template: `
    <div
      aria-label="Star rating"
      class="star-rating"
      role="group"
      (mouseleave)="hoveredIndex = null">
      <button
        *ngFor="let star of stars; let index = index"
        class="star-button"
        type="button"
        [attr.aria-label]="'Rate ' + (index + 1) + ' stars'"
        [attr.aria-pressed]="value === index + 1"
        (blur)="hoveredIndex = null"
        (click)="selectRating(index + 1)"
        (focus)="hoveredIndex = index"
        (mouseenter)="hoveredIndex = index">
        <app-star [isFilled]="isFilled(index)" />
      </button>
    </div>
  `,
})
export class StarRatingComponent {
  @Input() max = 5;
  @Input() value = 0;
  @Output() readonly valueChange = new EventEmitter<number>();

  hoveredIndex: number | null = null;

  get stars(): undefined[] {
    return Array.from({ length: this.max }, () => undefined);
  }

  isFilled(index: number): boolean {
    return this.hoveredIndex == null
      ? index < this.value
      : index <= this.hoveredIndex;
  }

  selectRating(nextValue: number): void {
    this.value = nextValue;
    this.valueChange.emit(nextValue);
  }
}
