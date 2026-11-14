<script>
  let count = 0;
</script>

<div class="wrapper">
  <div><button type="button" on:click={() => (count += 1)}>Add</button></div>
  <div class="bars">
    {#each Array(count) as _, index (index)}
      <div class="bar"><div class="bar__fill"></div></div>
    {/each}
  </div>
</div>

