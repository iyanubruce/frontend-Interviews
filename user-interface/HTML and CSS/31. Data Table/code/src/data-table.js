const columns = [
  { label: 'ID', key: 'id' },
  { label: 'Name', key: 'name' },
  { label: 'Age', key: 'age' },
  { label: 'Occupation', key: 'occupation' },
];

export default function createDataTable(container, users) {
  const table = document.createElement('table');
  const headerRow = document.createElement('tr');
  const body = document.createElement('tbody');

  columns.forEach(({ label }) => {
    const cell = document.createElement('th');
    cell.textContent = label;
    headerRow.append(cell);
  });

  users.forEach((user) => {
    const row = document.createElement('tr');
    columns.forEach(({ key }) => {
      const cell = document.createElement('td');
      cell.textContent = user[key];
      row.append(cell);
    });
    body.append(row);
  });

  const head = document.createElement('thead');
  head.append(headerRow);
  table.append(head, body);
  container.append(table);

  // TODO: Add page state, a page-size control, and previous/next buttons.
}
