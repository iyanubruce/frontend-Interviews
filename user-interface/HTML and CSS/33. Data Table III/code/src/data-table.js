const columns = [
  { label: 'ID', key: 'id' },
  { label: 'Name', key: 'name' },
  { label: 'Age', key: 'age' },
  { label: 'Occupation', key: 'occupation' },
];

function sortUsers(users, field, direction) {
  if (field == null) {
    return users.slice();
  }

  return users.slice().sort((a, b) => {
    const result =
      typeof a[field] === 'number'
        ? a[field] - b[field]
        : a[field].localeCompare(b[field]);
    return direction === 'asc' ? result : -result;
  });
}

export default function createDataTable(container, users) {
  let page = 1;
  let pageSize = 5;
  let sortField = null;
  let sortDirection = 'asc';

  const table = document.createElement('table');
  const headerRow = document.createElement('tr');
  const body = document.createElement('tbody');

  columns.forEach(({ label, key }) => {
    const cell = document.createElement('th');
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = label;
    button.addEventListener('click', () => {
      if (sortField === key) {
        sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        sortField = key;
        sortDirection = 'asc';
      }
      page = 1;
      update();
    });
    cell.append(button);
    headerRow.append(cell);
  });

  const head = document.createElement('thead');
  head.append(headerRow);
  table.append(head, body);

  const pageSizeSelect = document.createElement('select');
  pageSizeSelect.setAttribute('aria-label', 'Page size');
  [5, 10, 20].forEach((size) => {
    const option = document.createElement('option');
    option.value = size;
    option.textContent = 'Show ' + size;
    pageSizeSelect.append(option);
  });

  const previousButton = document.createElement('button');
  previousButton.type = 'button';
  previousButton.textContent = 'Prev';
  const pageNumber = document.createElement('span');
  pageNumber.setAttribute('aria-label', 'Page number');
  const nextButton = document.createElement('button');
  nextButton.type = 'button';
  nextButton.textContent = 'Next';

  pageSizeSelect.addEventListener('change', () => {
    pageSize = Number(pageSizeSelect.value);
    page = 1;
    update();
  });
  previousButton.addEventListener('click', () => {
    page -= 1;
    update();
  });
  nextButton.addEventListener('click', () => {
    page += 1;
    update();
  });

  const pages = document.createElement('div');
  pages.className = 'pages';
  pages.append(previousButton, pageNumber, nextButton);
  const pagination = document.createElement('div');
  pagination.className = 'pagination';
  pagination.append(pageSizeSelect, pages);
  container.append(table, document.createElement('hr'), pagination);

  function update() {
    const sortedUsers = sortUsers(users, sortField, sortDirection);
    const totalPages = Math.ceil(sortedUsers.length / pageSize);
    const start = (page - 1) * pageSize;
    const pageUsers = sortedUsers.slice(start, start + pageSize);

    body.replaceChildren();
    pageUsers.forEach((user) => {
      const row = document.createElement('tr');
      columns.forEach(({ key }) => {
        const cell = document.createElement('td');
        cell.textContent = user[key];
        row.append(cell);
      });
      body.append(row);
    });

    previousButton.disabled = page === 1;
    nextButton.disabled = page === totalPages;
    pageNumber.textContent = 'Page ' + page + ' of ' + totalPages;
  }

  update();
}
