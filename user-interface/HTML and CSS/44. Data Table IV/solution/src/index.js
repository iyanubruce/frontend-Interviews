import './styles.css';

import createDataTable from './data-table';
import houses from './data/houses';
import users from './data/users';

const userColumns = [
  {
    label: 'ID',
    key: 'id',
    renderCell: (row) => row.id,
    comparator: (a, b, direction) =>
      direction === 'asc' ? a.id - b.id : b.id - a.id,
    filterType: null,
  },
  {
    label: 'Name',
    key: 'name',
    renderCell: (row) => row.name,
    comparator: (a, b, direction) =>
      direction === 'asc'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name),
    filterType: 'string',
  },
  {
    label: 'Age',
    key: 'age',
    renderCell: (row) => row.age,
    comparator: (a, b, direction) =>
      direction === 'asc' ? a.age - b.age : b.age - a.age,
    filterType: 'range',
  },
  {
    label: 'Occupation',
    key: 'occupation',
    renderCell: (row) => row.occupation,
    comparator: (a, b, direction) =>
      direction === 'asc'
        ? a.occupation.localeCompare(b.occupation)
        : b.occupation.localeCompare(a.occupation),
    filterType: 'string',
  },
];
const houseColumns = [
  {
    label: 'ID',
    key: 'id',
    renderCell: (row) => row.id,
    comparator: (a, b, direction) =>
      direction === 'asc' ? a.id - b.id : b.id - a.id,
    filterType: null,
  },
  {
    label: 'Street',
    key: 'street',
    renderCell: (row) => row.street,
    comparator: (a, b, direction) =>
      direction === 'asc'
        ? a.street.localeCompare(b.street)
        : b.street.localeCompare(a.street),
    filterType: 'string',
  },
  {
    label: 'City',
    key: 'city',
    renderCell: (row) => row.city,
    comparator: (a, b, direction) =>
      direction === 'asc'
        ? a.city.localeCompare(b.city)
        : b.city.localeCompare(a.city),
    filterType: 'string',
  },
  {
    label: 'State',
    key: 'state',
    renderCell: (row) => row.state,
    comparator: (a, b, direction) =>
      direction === 'asc'
        ? a.state.localeCompare(b.state)
        : b.state.localeCompare(a.state),
    filterType: 'string',
  },
  {
    label: 'Built Year',
    key: 'built_year',
    renderCell: (row) => row.built_year,
    comparator: (a, b, direction) =>
      direction === 'asc'
        ? a.built_year - b.built_year
        : b.built_year - a.built_year,
    filterType: 'range',
  },
];

function renderTable(title, data, columns) {
  const heading = document.createElement('h2');
  heading.textContent = title;
  const container = document.createElement('div');

  document.querySelector('#app').append(heading, container);
  createDataTable(container, { columns, data });
}

renderTable('Users', users, userColumns);
renderTable('Houses', houses, houseColumns);
