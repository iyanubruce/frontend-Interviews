<script>
  export let data;

  const columns = [
    { label: "ID", key: "id" },
    { label: "Name", key: "name" },
    { label: "Age", key: "age" },
    { label: "Occupation", key: "occupation" },
  ];
</script>

<table>
  <thead>
    <tr>
      {#each columns as column}
        <th>{column.label}</th>
      {/each}
    </tr>
  </thead>
  <tbody>
    {#each data as user (user.id)}
      <tr>
        {#each columns as column}
          <td>{user[column.key]}</td>
        {/each}
      </tr>
    {/each}
  </tbody>
</table>

<!-- TODO: Add pagination state and controls. -->
