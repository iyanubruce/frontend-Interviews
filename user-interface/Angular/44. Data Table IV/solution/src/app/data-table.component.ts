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
  filterType: 'string' | 'range' | null;
}
type Filter =
  | { type: 'string'; value: string }
  | { type: 'range'; min: number | null; max: number | null };

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
  filters: Record<string, Filter> = {};

  get filteredData(): Array<TableRow> {
    return this.data.filter((row) =>
      Object.entries(this.filters).every(([key, filter]) => {
        const value = row[key];
        if (filter.type === 'string') {
          return (
            filter.value === '' ||
            String(value)
              .toLocaleLowerCase()
              .includes(filter.value.toLocaleLowerCase())
          );
        }

        const numberValue = Number(value);
        return (
          (filter.min == null || numberValue >= filter.min) &&
          (filter.max == null || numberValue <= filter.max)
        );
      }),
    );
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

  stringFilterValue(key: string): string {
    const filter = this.filters[key];
    return filter?.type === 'string' ? filter.value : '';
  }

  rangeFilterValue(key: string, boundary: 'min' | 'max'): number | '' {
    const filter = this.filters[key];
    if (filter?.type !== 'range') {
      return '';
    }
    return filter[boundary] ?? '';
  }

  setStringFilter(key: string, event: Event): void {
    this.filters = {
      ...this.filters,
      [key]: {
        type: 'string',
        value: (event.target as HTMLInputElement).value,
      },
    };
    this.page = 1;
  }

  setRangeFilter(key: string, boundary: 'min' | 'max', event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    const current = this.filters[key];
    const range =
      current?.type === 'range'
        ? current
        : { type: 'range' as const, min: null, max: null };
    this.filters = {
      ...this.filters,
      [key]: {
        ...range,
        [boundary]: value === '' ? null : Number(value),
      },
    };
    this.page = 1;
  }
}
