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
  },
  {
    label: 'Name',
    key: 'name',
    renderCell: (row) => row.name,
    comparator: (a, b, direction) =>
      direction === 'asc'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name),
  },
  {
    label: 'Age',
    key: 'age',
    renderCell: (row) => row.age,
    comparator: (a, b, direction) =>
      direction === 'asc' ? a.age - b.age : b.age - a.age,
  },
  {
    label: 'Occupation',
    key: 'occupation',
    renderCell: (row) => row.occupation,
    comparator: (a, b, direction) =>
      direction === 'asc'
        ? a.occupation.localeCompare(b.occupation)
        : b.occupation.localeCompare(a.occupation),
  },
];
const houseColumns = [
  {
    label: 'ID',
    key: 'id',
    renderCell: (row) => row.id,
    comparator: (a, b, direction) =>
      direction === 'asc' ? a.id - b.id : b.id - a.id,
  },
  {
    label: 'Street',
    key: 'street',
    renderCell: (row) => row.street,
    comparator: (a, b, direction) =>
      direction === 'asc'
        ? a.street.localeCompare(b.street)
        : b.street.localeCompare(a.street),
  },
  {
    label: 'City',
    key: 'city',
    renderCell: (row) => row.city,
    comparator: (a, b, direction) =>
      direction === 'asc'
        ? a.city.localeCompare(b.city)
        : b.city.localeCompare(a.city),
  },
  {
    label: 'State',
    key: 'state',
    renderCell: (row) => row.state,
    comparator: (a, b, direction) =>
      direction === 'asc'
        ? a.state.localeCompare(b.state)
        : b.state.localeCompare(a.state),
  },
  {
    label: 'Built Year',
    key: 'built_year',
    renderCell: (row) => row.built_year,
    comparator: (a, b, direction) =>
      direction === 'asc'
        ? a.built_year - b.built_year
        : b.built_year - a.built_year,
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
