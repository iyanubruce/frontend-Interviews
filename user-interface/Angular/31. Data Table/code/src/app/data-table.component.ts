import { Component } from '@angular/core';

import users from '../data/users';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
})
export class DataTableComponent {
  readonly users = users;
  readonly columns = [
    { label: 'ID', key: 'id' },
    { label: 'Name', key: 'name' },
    { label: 'Age', key: 'age' },
    { label: 'Occupation', key: 'occupation' },
  ];
}
