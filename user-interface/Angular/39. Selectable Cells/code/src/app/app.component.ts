import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: '<div>{{ message }}</div>',
})
export class AppComponent {
  message = 'Hello World!';
}
