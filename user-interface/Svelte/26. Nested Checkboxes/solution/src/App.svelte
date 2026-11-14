<script>
  import CheckboxNode from './CheckboxNode.svelte';

  let checkboxData = [
    {
      id: 1,
      name: 'Electronics',
      checked: false,
      children: [
        {
          id: 2,
          name: 'Mobile phones',
          checked: false,
          children: [
            { id: 3, name: 'iPhone', checked: false },
            { id: 4, name: 'Android', checked: false },
          ],
        },
        {
          id: 5,
          name: 'Laptops',
          checked: false,
          children: [
            { id: 6, name: 'MacBook', checked: false },
            { id: 7, name: 'Surface Pro', checked: false },
          ],
        },
      ],
    },
    {
      id: 8,
      name: 'Books',
      checked: false,
      children: [
        { id: 9, name: 'Fiction', checked: false },
        { id: 10, name: 'Non-fiction', checked: false },
      ],
    },
    { id: 11, name: 'Toys', checked: false },
  ];

  function updateDescendants(item, checked) {
    item.checked = checked;
    item.children?.forEach((child) => updateDescendants(child, checked));
  }

  function resolveStates(items) {
    items.forEach((item) => {
      if (!item.children?.length) return;
      resolveStates(item.children);
      if (item.children.every((child) => child.checked === true)) {
        item.checked = true;
      } else if (item.children.every((child) => child.checked === false)) {
        item.checked = false;
      } else {
        item.checked = 'indeterminate';
      }
    });
  }

  function handleToggle({ checked, path }) {
    const next = JSON.parse(JSON.stringify(checkboxData));
    const item = path.reduce((items, index, depth) => {
      const current = items[index];
      return depth === path.length - 1 ? current : current.children;
    }, next);

    updateDescendants(item, checked);
    resolveStates(next);
    checkboxData = next;
  }
</script>

<ul>
  {#each checkboxData as item, index (item.id)}
    <CheckboxNode
      {item}
      on:toggle={(event) =>
        handleToggle({
          checked: event.detail.checked,
          path: [index, ...event.detail.path],
        })}
    />
  {/each}
</ul>

