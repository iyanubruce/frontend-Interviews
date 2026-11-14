<script>
  import FileItem from "./FileItem.svelte";

  export let data;

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
  {#each items as file (file.id)}
    <FileItem {file} />
  {/each}
</ul>
