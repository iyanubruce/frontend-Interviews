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
  let sortField = null;
  let sortDirection = "asc";

  function sortUsers(users, field, direction) {
    if (field == null) {
      return users.slice();
    }

    return users.slice().sort((a, b) => {
      const result =
        typeof a[field] === "number"
          ? a[field] - b[field]
          : a[field].localeCompare(b[field]);
      return direction === "asc" ? result : -result;
    });
  }

  function changePageSize(event) {
    pageSize = Number(event.currentTarget.value);
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

  $: sortedUsers = sortUsers(data, sortField, sortDirection);
  $: totalPages = Math.ceil(sortedUsers.length / pageSize);
  $: pageUsers = sortedUsers.slice((page - 1) * pageSize, page * pageSize);
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
