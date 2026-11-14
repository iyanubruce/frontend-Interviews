import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <h1>Hello world</h1>
    <pre>{{ checkboxesData | json }}</pre>
  `,
})
export class AppComponent {
  checkboxesData = [
    {
      id: 1,
      name: 'Electronics',
      checked: false,
      children: [
        { id: 2, name: 'Mobile phones', checked: false },
        { id: 3, name: 'Laptops', checked: false },
      ],
    },
    { id: 4, name: 'Books', checked: false },
  ];
}
