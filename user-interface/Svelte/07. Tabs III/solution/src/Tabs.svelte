<script>
  export let items;
  export let defaultValue = undefined;
  const tabsId = 'tabs-' + Math.random().toString(36).slice(2);
  let value = defaultValue ?? items[0].value;
  const tabId = (itemValue) => `${tabsId}-tab-${itemValue}`;
  const panelId = (itemValue) => `${tabsId}-tabpanel-${itemValue}`;

  function activateIndex(index) {
    value = items[index].value;
    document.getElementById(tabId(value)).focus();
  }

  function handleKeydown(event) {
    const currentIndex = items.findIndex((item) => item.value === value);
    let nextIndex;
    if (event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + items.length) % items.length;
    if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % items.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = items.length - 1;
    if (nextIndex == null) return;
    event.preventDefault();
    activateIndex(nextIndex);
  }
</script>

<div class="tabs">
  <div class="tabs-list" role="tablist" on:keydown={handleKeydown}>
    {#each items as item (item.value)}
      <button
        aria-controls={panelId(item.value)}
        aria-selected={item.value === value}
        id={tabId(item.value)}
        role="tab"
        tabindex={item.value === value ? 0 : -1}
        type="button"
        class:tabs-list-item--active={item.value === value}
        class="tabs-list-item"
        on:click={() => (value = item.value)}>
        {item.label}
      </button>
    {/each}
  </div>
  {#each items as item (item.value)}
    <div
      aria-labelledby={tabId(item.value)}
      hidden={item.value !== value}
      id={panelId(item.value)}
      role="tabpanel"
      tabindex="0">
      {item.panel}
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
