<script>
  export let data;

  const columns = [
    { label: "ID", key: "id" },
    { label: "Name", key: "name" },
    { label: "Age", key: "age" },
    { label: "Occupation", key: "occupation" },
  ];
  const pageSizes = [5, 10, 20];

  let page = 1;
  let pageSize = 5;

  function changePageSize(event) {
    pageSize = Number(event.currentTarget.value);
    page = 1;
  }

  $: totalPages = Math.ceil(data.length / pageSize);
  $: pageUsers = data.slice((page - 1) * pageSize, page * pageSize);
</script>

<table>
  <thead>
    <tr>
      {#each columns as column}
        <th>
          {column.label}
        </th>
      {/each}
    </tr>
  </thead>
  <tbody>
    {#each pageUsers as user (user.id)}
      <tr>
        {#each columns as column}
          <td>{user[column.key]}</td>
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
    <button type="button" disabled={page === 1} on:click={() => (page -= 1)}>
      Prev
    </button>
    <span aria-label="Page number">Page {page} of {totalPages}</span>
    <button
      type="button"
      disabled={page === totalPages}
      on:click={() => (page += 1)}
    >
      Next
    </button>
  </div>
</div>
