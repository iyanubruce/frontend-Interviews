<script>
  let nextId = 3;
  let selected = '';
  let search = '';
  let first = '';
  let last = '';
  let users = [
    { first: 'Hans', last: 'Emil', id: '0' },
    { first: 'Max', last: 'Mustermann', id: '1' },
    { first: 'Roman', last: 'Tisch', id: '2' },
  ];

  $: filteredUsers = users.filter((user) =>
    `${user.first} ${user.last}`.toLowerCase().includes(search.toLowerCase()),
  );
  $: hasSelection = selected !== '';
  $: hasNames = first.trim() !== '' && last.trim() !== '';

  function clearSelection() {
    selected = '';
    first = '';
    last = '';
  }

  function selectUser(event) {
    selected = event.currentTarget.value;
    const user = users.find((item) => item.id === selected);
    first = user?.first ?? '';
    last = user?.last ?? '';
  }

  function createUser() {
    users = [...users, { first, last, id: String(nextId++) }];
    clearSelection();
  }

  function updateUser() {
    users = users.map((user) =>
      user.id === selected ? { ...user, first, last } : user,
    );
  }

  function deleteUser() {
    users = users.filter((user) => user.id !== selected);
    clearSelection();
  }

  function performAction(event) {
    const action = event.submitter?.value;
    if (action === 'create') createUser();
    if (action === 'update') updateUser();
    if (action === 'delete') deleteUser();
    if (action === 'cancel') clearSelection();
  }
</script>

<form class="app" on:submit|preventDefault={performAction}>
  <input aria-label="Search users" bind:value={search} placeholder="Search" />
  <div class="middle-row">
    <select
      aria-label="Users"
      class="users-list"
      size="5"
      value={selected}
      on:change={selectUser}>
      {#each filteredUsers as user (user.id)}
        <option value={user.id}>{user.first} {user.last}</option>
      {/each}
    </select>
    <div class="inputs">
      <label>First Name: <input bind:value={first} /></label>
      <label>Last Name: <input bind:value={last} /></label>
    </div>
  </div>
  <div class="buttons">
    <button disabled={hasSelection || !hasNames} type="submit" value="create">Create</button>
    <button disabled={!hasSelection || !hasNames} type="submit" value="update">Update</button>
    <button disabled={!hasSelection} type="submit" value="delete">Delete</button>
    <button disabled={!hasSelection} type="submit" value="cancel">Cancel</button>
  </div>
</form>

<style>
  .app { display: flex; flex-direction: column; gap: 16px; }
  .middle-row, .buttons { display: flex; gap: 16px; }
  .buttons { gap: 4px; }
  .inputs { display: flex; flex-direction: column; gap: 8px; }
  input { display: block; }
  .users-list { width: 14em; }
</style>
