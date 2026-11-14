<script>
  const max = 5;
</script>

<div class="star-rating">
  {#each Array(max) as _, index}
    <button aria-label={`Rate ${index + 1} stars`} class="star" type="button">☆</button>
  {/each}
</div>

<style>
  .star-rating { display: flex; }
  .star { background: none; border: 0; cursor: pointer; font-size: 32px; padding: 0; }
</style>
