<script>
  export let data;

  let expandedPaths = new Set();

  function sortItems(items) {
    const directories = items
      .filter((item) => Array.isArray(item.children))
      .sort((a, b) => a.name.localeCompare(b.name));
    const files = items
      .filter((item) => !Array.isArray(item.children))
      .sort((a, b) => a.name.localeCompare(b.name));
    return [...directories, ...files];
  }

  function flatten(items, level, parentPath, expanded) {
    const rows = [];
    sortItems(items).forEach((file, index) => {
      const path = parentPath + "-" + index;
      rows.push({ file, level, path });
      if (Array.isArray(file.children) && expanded.has(path)) {
        rows.push(...flatten(file.children, level + 1, path, expanded));
      }
    });
    return rows;
  }

  function toggle(path) {
    const next = new Set(expandedPaths);
    if (next.has(path)) {
      next.delete(path);
    } else {
      next.add(path);
    }
    expandedPaths = next;
  }

  $: rows = flatten(data, 1, "root", expandedPaths);
</script>

<ul class="file-list">
  {#each rows as row (row.path)}
    <li class="file-item" style="padding-left: {(row.level - 1) * 16}px">
      {#if Array.isArray(row.file.children)}
        <button
          type="button"
          class="file-item-button file-item-button--directory"
          on:click={() => toggle(row.path)}
        >
          <span>{row.file.name}</span>
          [{expandedPaths.has(row.path) ? "-" : "+"}]
        </button>
      {:else}
        <span class="file-item-button">{row.file.name}</span>
      {/if}
    </li>
  {/each}
</ul>
