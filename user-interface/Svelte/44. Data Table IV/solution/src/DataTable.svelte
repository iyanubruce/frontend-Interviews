<script>
  export let columns;
  export let data;

  const pageSizes = [5, 10, 20];
  let page = 1;
  let pageSize = 5;
  let sortField = null;
  let sortDirection = "asc";
  let filters = {};

  function sortData(rows, columnDefs, field, direction) {
    const comparator = columnDefs.find(
      (column) => column.key === field,
    )?.comparator;
    return comparator == null
      ? rows.slice()
      : rows.slice().sort((a, b) => comparator(a, b, direction));
  }

  function filterData(rows, activeFilters) {
    return rows.filter((row) =>
      Object.entries(activeFilters).every(([key, filter]) => {
        const value = row[key];
        if (filter.type === "string") {
          return (
            filter.value === "" ||
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

  function setStringFilter(key, event) {
    filters = {
      ...filters,
      [key]: { type: "string", value: event.currentTarget.value },
    };
    page = 1;
  }

  function setRangeFilter(key, boundary, event) {
    filters = {
      ...filters,
      [key]: {
        ...(filters[key] ?? { type: "range", min: null, max: null }),
        [boundary]:
          event.currentTarget.value === ""
            ? null
            : Number(event.currentTarget.value),
      },
    };
    page = 1;
  }

  function sortBy(key) {
    if (sortField === key) {
      sortDirection = sortDirection === "asc" ? "desc" : "asc";
    } else {
      sortField = key;
      sortDirection = "asc";
    }
    page = 1;
  }

  function changePageSize(event) {
    pageSize = Number(event.currentTarget.value);
    page = 1;
  }

  $: filteredData = filterData(data, filters);
  $: sortedData = sortData(filteredData, columns, sortField, sortDirection);
  $: totalPages = Math.ceil(sortedData.length / pageSize);
  $: if (totalPages > 0 && page > totalPages) page = totalPages;
  $: pageData = sortedData.slice((page - 1) * pageSize, page * pageSize);
</script>

<table>
  <thead>
    <tr>
      {#each columns as column}
        <th>
          <button type="button" on:click={() => sortBy(column.key)}>
            {column.label}
          </button>
          {#if column.filterType === "string"}
            <div class="filter-input">
              <input
                aria-label={"Filter " + column.label}
                placeholder="Search..."
                type="search"
                value={filters[column.key]?.value ?? ""}
                on:input={(event) => setStringFilter(column.key, event)}
              />
            </div>
          {:else if column.filterType === "range"}
            <div class="filter-input filter-input--range">
              <input
                aria-label={column.label + " min"}
                placeholder="Min"
                type="number"
                value={filters[column.key]?.min ?? ""}
                on:input={(event) => setRangeFilter(column.key, "min", event)}
              />
              <input
                aria-label={column.label + " max"}
                placeholder="Max"
                type="number"
                value={filters[column.key]?.max ?? ""}
                on:input={(event) => setRangeFilter(column.key, "max", event)}
              />
            </div>
          {/if}
        </th>
      {/each}
    </tr>
  </thead>
  <tbody>
    {#each pageData as item (item.id)}
      <tr>
        {#each columns as column}
          <td>{column.renderCell(item)}</td>
        {/each}
      </tr>
    {/each}
  </tbody>
</table>

<hr />

<div class="pagination">
  <select aria-label="Page size" value={pageSize} on:change={changePageSize}>
    {#each pageSizes as size}
      <option value={size}>Show {size}</option>
    {/each}
  </select>
  <div class="pages">
    <button type="button" disabled={page <= 1} on:click={() => (page -= 1)}>
      Prev
    </button>
    {#if totalPages === 0}
      <span>0 pages</span>
    {:else}
      <span aria-label="Page number">Page {page} of {totalPages}</span>
    {/if}
    <button
      type="button"
      disabled={totalPages === 0 || page >= totalPages}
      on:click={() => (page += 1)}
    >
      Next
    </button>
  </div>
</div>
