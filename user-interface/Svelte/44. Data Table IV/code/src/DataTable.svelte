<script>
  export let columns;
  export let data;

  const pageSizes = [5, 10, 20];
  let page = 1;
  let pageSize = 5;
  let sortField = null;
  let sortDirection = "asc";

  function sortData(rows) {
    const comparator = columns.find(
      (column) => column.key === sortField,
    )?.comparator;
    return comparator == null
      ? rows.slice()
      : rows.slice().sort((a, b) => comparator(a, b, sortDirection));
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

  $: filteredData = data;
  $: sortedData = sortData(filteredData);
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
