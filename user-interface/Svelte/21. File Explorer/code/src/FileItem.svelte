<script>
  export let file;

  const isDirectory = Array.isArray(file.children);
</script>

<li class="file-item">
  <button
    type="button"
    class:file-item-button={true}
    class:file-item-button--directory={isDirectory}
  >
    <span>{file.name}</span>
  </button>
  <!-- TODO: Render nested children and add directory expansion. -->
</li>
