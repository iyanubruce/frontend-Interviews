<script>
  import FileExplorer from "./FileExplorer.svelte";

  export let file;
  export let level;
  export let path;
  export let posInSet;
  export let setSize;

  const isDirectory = Array.isArray(file.children);
  let expanded = false;

  $: labelId = "file-label-" + path;

  function toggle() {
    if (isDirectory) {
      expanded = !expanded;
    }
  }
</script>

<li
  class="file-item"
  role="treeitem"
  aria-expanded={isDirectory ? expanded : undefined}
  aria-labelledby={labelId}
  aria-level={level}
  aria-posinset={posInSet}
  aria-setsize={setSize}
>
  <button
    type="button"
    class:file-item-button={true}
    class:file-item-button--directory={isDirectory}
    on:click={toggle}
  >
    <span id={labelId}>{file.name}</span>
    {#if isDirectory}[{expanded ? "-" : "+"}]{/if}
  </button>
  {#if isDirectory && file.children.length > 0 && expanded}
    <FileExplorer data={file.children} level={level + 1} {path} />
  {/if}
</li>
