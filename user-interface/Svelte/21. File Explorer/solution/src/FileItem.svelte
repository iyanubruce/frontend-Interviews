<script>
  import FileExplorer from "./FileExplorer.svelte";

  export let file;
  export let path;
  export let posInSet;
  export let setSize;

  const isDirectory = Array.isArray(file.children);
  let expanded = false;

  function toggle() {
    if (isDirectory) {
      expanded = !expanded;
    }
  }
</script>

<li class="file-item">
  {#if isDirectory}
    <button
      type="button"
      class="file-item-button file-item-button--directory"
      on:click={toggle}
    >
      <span>{file.name}</span> [{expanded ? "-" : "+"}]
    </button>
  {:else}
    <span class="file-item-button">{file.name}</span>
  {/if}
  {#if isDirectory && file.children.length > 0 && expanded}
    <FileExplorer data={file.children} {path} />
  {/if}
</li>
