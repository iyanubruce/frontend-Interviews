import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <app-star-rating [(value)]="primaryRating" [max]="5" />
    <p>Selected rating: {{ primaryRating }}</p>

    <app-star-rating [(value)]="secondaryRating" [max]="10" />
    <p>Selected rating: {{ secondaryRating }}</p>
  `,
})
export class AppComponent {
  primaryRating = 3;
  secondaryRating = 5;
}
