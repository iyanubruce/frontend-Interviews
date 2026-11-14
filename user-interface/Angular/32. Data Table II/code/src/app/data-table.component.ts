import { Component } from '@angular/core';

import users from '../data/users';

type User = (typeof users)[number];
type SortField = keyof User;

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
})
export class DataTableComponent {
  readonly columns: ReadonlyArray<{ label: string; key: SortField }> = [
    { label: 'ID', key: 'id' },
    { label: 'Name', key: 'name' },
    { label: 'Age', key: 'age' },
    { label: 'Occupation', key: 'occupation' },
  ];
  readonly pageSizes = [5, 10, 20];

  page = 1;
  pageSize = 5;

  get totalPages(): number {
    return Math.ceil(users.length / this.pageSize);
  }

  get pageUsers(): Array<User> {
    const start = (this.page - 1) * this.pageSize;
    return users.slice(start, start + this.pageSize);
  }

  changePageSize(event: Event): void {
    this.pageSize = Number((event.target as HTMLSelectElement).value);
    this.page = 1;
  }
}
