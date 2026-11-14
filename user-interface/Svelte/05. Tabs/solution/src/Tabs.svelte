<script>
  export let items;
  export let defaultValue = undefined;
  let value = defaultValue ?? items[0].value;
</script>

<div class="tabs">
  <div class="tabs-list">
    {#each items as item (item.value)}
      <button
        type="button"
        class:tabs-list-item--active={item.value === value}
        class="tabs-list-item"
        on:click={() => (value = item.value)}>
        {item.label}
      </button>
    {/each}
  </div>
  {#each items as item (item.value)}
    <div hidden={item.value !== value}>
      <p>{item.panel}</p>
    </div>
  {/each}
</div>

<style>
  .tabs {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .tabs-list {
    display: flex;
    gap: 6px;
  }
  
  .tabs-list-item {
    --active-color: blueviolet;
    background: none;
    border: 1px solid #000;
    border-radius: 4px;
    cursor: pointer;
    padding: 6px 10px;
  }
  
  .tabs-list-item:hover {
    border-color: var(--active-color);
    color: var(--active-color);
  }
  
  .tabs-list-item--active {
    background: var(--active-color);
    border-color: var(--active-color);
    color: #fff;
  }
</style>
