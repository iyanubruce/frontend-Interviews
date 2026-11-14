<script>
  import { createEventDispatcher } from 'svelte';

  export let item;
  const dispatch = createEventDispatcher();
  let input;

  $: if (input) {
    input.indeterminate = item.checked === 'indeterminate';
  }
</script>

<li>
  <label class="checkbox">
    <input
      bind:this={input}
      type="checkbox"
      checked={item.checked === true}
      on:change={(event) =>
        dispatch('toggle', {
          checked: event.currentTarget.checked,
          path: [],
        })}
    />
    {item.name}
  </label>

  {#if item.children?.length}
    <ul>
      {#each item.children as child, index (child.id)}
        <svelte:self
          item={child}
          on:toggle={(event) =>
            dispatch('toggle', {
              checked: event.detail.checked,
              path: [index, ...event.detail.path],
            })}
        />
      {/each}
    </ul>
  {/if}
</li>

