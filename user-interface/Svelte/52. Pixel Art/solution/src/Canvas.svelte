<script>
  import { COLORS } from './colors';
  export let selectedColor;
  export let mode;
  export let initialRows = 15;
  export let initialColumns = 15;

  let grid = Array.from({ length: initialRows }, () =>
    Array(initialColumns).fill(null),
  );

  let isDragging = false;

  function mark(rowIndex, cellIndex) {
    grid[rowIndex][cellIndex] =
      mode === 'erase' ? null : selectedColor;
  }

  function endDragging() {
    isDragging = false;
  }
</script>

<svelte:window
  on:pointerup={endDragging}
  on:pointercancel={endDragging}
  on:blur={endDragging} />

<div class="grid" aria-label="Pixel art canvas" role="group">
  {#each grid as row, rowIndex (rowIndex)}
    <div
      class={`grid__row ${
        rowIndex % 2 === 0
          ? 'grid__row--even'
          : 'grid__row--odd'
      }`}>
      {#each row as cellColor, cellIndex (cellIndex)}
        <button
          aria-label={`Pixel row ${rowIndex + 1}, column ${
            cellIndex + 1
          }, ${cellColor ?? 'empty'}`}
          aria-pressed={cellColor != null}
          on:click={() => mark(rowIndex, cellIndex)}
          on:pointerdown={(event) => {
            if (event.button !== 0) {
              return;
            }

            isDragging = true;
            mark(rowIndex, cellIndex);
          }}
          on:pointerenter={() => {
            if (isDragging) {
              mark(rowIndex, cellIndex);
            }
          }}
          style:background-color={cellColor != null
            ? COLORS[cellColor]
            : undefined}
          class="grid__cell"
          type="button"></button>
      {/each}
    </div>
  {/each}
</div>

<style>
  .grid {
    display: flex;
    flex-direction: column;
  }

  .grid__row {
    display: flex;
    flex-shrink: 0;
  }

  .grid__cell {
    --cell-size: 20px;

    height: var(--cell-size);
    width: var(--cell-size);
    border: 0;
    flex-shrink: 0;
    background-color: transparent;
  }

  .grid__row--even .grid__cell:nth-child(odd),
  .grid__row--odd .grid__cell:nth-child(even) {
    background-color: #e9ecef;
  }
</style>
