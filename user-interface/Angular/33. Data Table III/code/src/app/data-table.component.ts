import { Component } from '@angular/core';

import users from '../data/users';

type User = (typeof users)[number];
type SortField = keyof User;
type SortDirection = 'asc' | 'desc';

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
  sortField: SortField | null = null;
  sortDirection: SortDirection = 'asc';

  get sortedUsers(): Array<User> {
    if (this.sortField == null) {
      return users.slice();
    }

    const field = this.sortField;
    return users.slice().sort((a, b) => {
      const left = a[field];
      const right = b[field];
      const result =
        typeof left === 'number' && typeof right === 'number'
          ? left - right
          : String(left).localeCompare(String(right));
      return this.sortDirection === 'asc' ? result : -result;
    });
  }

  get totalPages(): number {
    return Math.ceil(this.sortedUsers.length / this.pageSize);
  }

  get pageUsers(): Array<User> {
    const start = (this.page - 1) * this.pageSize;
    return this.sortedUsers.slice(start, start + this.pageSize);
  }

  changePageSize(event: Event): void {
    this.pageSize = Number((event.target as HTMLSelectElement).value);
    this.page = 1;
  }

  sortBy(key: SortField): void {
    if (this.sortField === key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = key;
      this.sortDirection = 'asc';
    }
    this.page = 1;
  }
}
