<script>
  import FileItem from "./FileItem.svelte";

  export let data;
  export let level = 1;
  export let path = "root";

  function sortItems(items) {
    const directories = items
      .filter((item) => Array.isArray(item.children))
      .sort((a, b) => a.name.localeCompare(b.name));
    const files = items
      .filter((item) => !Array.isArray(item.children))
      .sort((a, b) => a.name.localeCompare(b.name));
    return [...directories, ...files];
  }

  $: items = sortItems(data);
</script>

<ul class="file-list">
  {#each items as file, index (path + "-" + index)}
    <FileItem
      {file}
      {level}
      path={path + "-" + index}
      posInSet={index + 1}
      setSize={items.length}
    />
  {/each}
</ul>
