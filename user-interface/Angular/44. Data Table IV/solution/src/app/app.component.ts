import { Component } from '@angular/core';

import houses from '../data/houses';
import users from '../data/users';
import {
  ColumnDefinition,
  SortDirection,
  TableRow,
} from './data-table.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  readonly users = users;
  readonly houses = houses;

  readonly userColumns: Array<ColumnDefinition> = [
    {
      label: 'ID',
      key: 'id',
      renderCell: (row: TableRow) => row['id'],
      comparator: (a: TableRow, b: TableRow, direction: SortDirection) => {
        const result = Number(a['id']) - Number(b['id']);
        return direction === 'asc' ? result : -result;
      },
      filterType: null,
    },
    {
      label: 'Name',
      key: 'name',
      renderCell: (row: TableRow) => row['name'],
      comparator: (a: TableRow, b: TableRow, direction: SortDirection) => {
        const result = String(a['name']).localeCompare(String(b['name']));
        return direction === 'asc' ? result : -result;
      },
      filterType: 'string',
    },
    {
      label: 'Age',
      key: 'age',
      renderCell: (row: TableRow) => row['age'],
      comparator: (a: TableRow, b: TableRow, direction: SortDirection) => {
        const result = Number(a['age']) - Number(b['age']);
        return direction === 'asc' ? result : -result;
      },
      filterType: 'range',
    },
    {
      label: 'Occupation',
      key: 'occupation',
      renderCell: (row: TableRow) => row['occupation'],
      comparator: (a: TableRow, b: TableRow, direction: SortDirection) => {
        const result = String(a['occupation']).localeCompare(
          String(b['occupation']),
        );
        return direction === 'asc' ? result : -result;
      },
      filterType: 'string',
    },
  ];

  readonly houseColumns: Array<ColumnDefinition> = [
    {
      label: 'ID',
      key: 'id',
      renderCell: (row: TableRow) => row['id'],
      comparator: (a: TableRow, b: TableRow, direction: SortDirection) => {
        const result = Number(a['id']) - Number(b['id']);
        return direction === 'asc' ? result : -result;
      },
      filterType: null,
    },
    {
      label: 'Street',
      key: 'street',
      renderCell: (row: TableRow) => row['street'],
      comparator: (a: TableRow, b: TableRow, direction: SortDirection) => {
        const result = String(a['street']).localeCompare(String(b['street']));
        return direction === 'asc' ? result : -result;
      },
      filterType: 'string',
    },
    {
      label: 'City',
      key: 'city',
      renderCell: (row: TableRow) => row['city'],
      comparator: (a: TableRow, b: TableRow, direction: SortDirection) => {
        const result = String(a['city']).localeCompare(String(b['city']));
        return direction === 'asc' ? result : -result;
      },
      filterType: 'string',
    },
    {
      label: 'State',
      key: 'state',
      renderCell: (row: TableRow) => row['state'],
      comparator: (a: TableRow, b: TableRow, direction: SortDirection) => {
        const result = String(a['state']).localeCompare(String(b['state']));
        return direction === 'asc' ? result : -result;
      },
      filterType: 'string',
    },
    {
      label: 'Built Year',
      key: 'built_year',
      renderCell: (row: TableRow) => row['built_year'],
      comparator: (a: TableRow, b: TableRow, direction: SortDirection) => {
        const result = Number(a['built_year']) - Number(b['built_year']);
        return direction === 'asc' ? result : -result;
      },
      filterType: 'range',
    },
  ];
}
