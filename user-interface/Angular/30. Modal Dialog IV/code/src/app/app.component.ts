import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <button type="button" (click)="open = true">Show modal</button>
    <app-modal-dialog *ngIf="open" title="Feedback" (close)="open = false">
      <div class="contents">
        <div>Provide your feedback, we will get back in 3-5 business days.</div>
        <input placeholder="john@gmail.com" />
        <textarea placeholder="Your message here" rows="5"></textarea>
        <button type="button">Submit</button>
      </div>
    </app-modal-dialog>
  `,
})
export class AppComponent {
  open = false;
}
