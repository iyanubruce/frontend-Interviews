import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <input aria-label="Search users" placeholder="Search" />
    <select size="5">
      <option>Hans Emil</option>
    </select>
    <label>First Name: <input /></label>
    <label>Last Name: <input /></label>
    <button type="button">Create</button>
  `,
})
export class AppComponent {}
