import { Component, Input } from '@angular/core';

export type SortDirection = 'asc' | 'desc';
export interface TableRow {
  id: number;
  [key: string]: string | number;
}
export interface ColumnDefinition {
  label: string;
  key: string;
  renderCell: (row: TableRow) => string | number;
  comparator: (a: TableRow, b: TableRow, direction: SortDirection) => number;
}
@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
})
export class DataTableComponent {
  @Input() columns: Array<ColumnDefinition> = [];
  @Input() data: Array<TableRow> = [];

  readonly pageSizes = [5, 10, 20];
  page = 1;
  pageSize = 5;
  sortField: string | null = null;
  sortDirection: SortDirection = 'asc';

  get filteredData(): Array<TableRow> {
    return this.data;
  }

  get sortedData(): Array<TableRow> {
    const comparator = this.columns.find(
      (column) => column.key === this.sortField,
    )?.comparator;
    return comparator == null
      ? this.filteredData.slice()
      : this.filteredData
          .slice()
          .sort((a, b) => comparator(a, b, this.sortDirection));
  }

  get totalPages(): number {
    return Math.ceil(this.sortedData.length / this.pageSize);
  }

  get pageData(): Array<TableRow> {
    const start = (this.page - 1) * this.pageSize;
    return this.sortedData.slice(start, start + this.pageSize);
  }

  sortBy(key: string): void {
    if (this.sortField === key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = key;
      this.sortDirection = 'asc';
    }
    this.page = 1;
  }

  changePageSize(event: Event): void {
    this.pageSize = Number((event.target as HTMLSelectElement).value);
    this.page = 1;
  }
}
