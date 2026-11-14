<script>
  export let max;
  export let value;
  export let onChange;

  let hoveredIndex = null;

  function selectRating(nextValue) {
    value = nextValue;
    onChange(nextValue);
  }
</script>

<div
  aria-label="Star rating"
  class="star-rating"
  role="group"
  on:mouseleave={() => (hoveredIndex = null)}>
  {#each Array(max) as _, index}
    <button
      aria-label={`Rate ${index + 1} stars`}
      aria-pressed={value === index + 1}
      class="star-button"
      type="button"
      on:blur={() => (hoveredIndex = null)}
      on:click={() => selectRating(index + 1)}
      on:focus={() => (hoveredIndex = index)}
      on:mouseenter={() => (hoveredIndex = index)}>
      <svg
        aria-hidden="true"
        class:star-icon-filled={hoveredIndex == null
          ? index < value
          : index <= hoveredIndex}
        class="star-icon"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    </button>
  {/each}
</div>

<style>
  .star-rating {
    display: flex;
  }

  .star-button {
    background: none;
    border: 0;
    cursor: pointer;
    padding: 0;
  }

  .star-button:focus-visible {
    outline: 2px solid royalblue;
  }

  .star-icon {
    height: 32px;
    width: 32px;
  }

  .star-icon-filled {
    fill: #f5c518;
  }
</style>
