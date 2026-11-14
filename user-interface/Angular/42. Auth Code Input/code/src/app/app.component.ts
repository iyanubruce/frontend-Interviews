import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <form (submit)="$event.preventDefault()">
      <input type="text" inputmode="numeric" autocomplete="one-time-code" />
      <button type="reset">Reset</button>
      <button type="submit">Submit</button>
    </form>
  `,
})
export class AppComponent {}
