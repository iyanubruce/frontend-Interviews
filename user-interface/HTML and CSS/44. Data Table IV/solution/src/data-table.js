function sortData(data, columns, field, direction) {
  const matchedColumn = columns.find((column) => column.key === field);
  const comparator =
    matchedColumn == null ? undefined : matchedColumn.comparator;
  return comparator == null
    ? data.slice()
    : data.slice().sort((a, b) => comparator(a, b, direction));
}

function filterData(data, filters) {
  return data.filter((row) =>
    Object.entries(filters).every(([key, filter]) => {
      const value = row[key];
      if (filter.type === 'string') {
        return (
          filter.value === '' ||
          String(value)
            .toLocaleLowerCase()
            .includes(filter.value.toLocaleLowerCase())
        );
      }
      return (
        (filter.min == null || value >= filter.min) &&
        (filter.max == null || value <= filter.max)
      );
    }),
  );
}

export default function createDataTable(container, { columns, data }) {
  let page = 1;
  let pageSize = 5;
  let sortField = null;
  let sortDirection = 'asc';
  const filters = {};

  const table = document.createElement('table');
  const headerRow = document.createElement('tr');
  const body = document.createElement('tbody');

  columns.forEach(({ label, key, filterType }) => {
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

    if (filterType === 'string') {
      const wrapper = document.createElement('div');
      wrapper.className = 'filter-input';
      const input = document.createElement('input');
      input.type = 'search';
      input.placeholder = 'Search...';
      input.setAttribute('aria-label', 'Filter ' + label);
      input.addEventListener('input', () => {
        filters[key] = { type: 'string', value: input.value };
        page = 1;
        update();
      });
      wrapper.append(input);
      cell.append(wrapper);
    }

    if (filterType === 'range') {
      const wrapper = document.createElement('div');
      wrapper.className = 'filter-input filter-input--range';
      ['min', 'max'].forEach((boundary) => {
        const input = document.createElement('input');
        input.type = 'number';
        input.placeholder = boundary === 'min' ? 'Min' : 'Max';
        input.setAttribute('aria-label', label + ' ' + boundary);
        input.addEventListener('input', () => {
          const current =
            filters[key] == null
              ? {
                  type: 'range',
                  min: null,
                  max: null,
                }
              : filters[key];
          current[boundary] = input.value === '' ? null : Number(input.value);
          filters[key] = current;
          page = 1;
          update();
        });
        wrapper.append(input);
      });
      cell.append(wrapper);
    }

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
    const filteredData = filterData(data, filters);
    const sortedData = sortData(
      filteredData,
      columns,
      sortField,
      sortDirection,
    );
    const totalPages = Math.ceil(sortedData.length / pageSize);
    if (totalPages > 0 && page > totalPages) {
      page = totalPages;
    }
    const start = (page - 1) * pageSize;
    const pageData = sortedData.slice(start, start + pageSize);

    body.replaceChildren();
    pageData.forEach((item) => {
      const row = document.createElement('tr');
      columns.forEach(({ renderCell }) => {
        const cell = document.createElement('td');
        cell.textContent = renderCell(item);
        row.append(cell);
      });
      body.append(row);
    });

    previousButton.disabled = page <= 1;
    nextButton.disabled = totalPages === 0 || page >= totalPages;
    pageNumber.textContent =
      totalPages === 0 ? '0 pages' : 'Page ' + page + ' of ' + totalPages;
  }

  update();
}
