<script>
  const ROWS = 10;
  const COLUMNS = 10;

  let dragArea;
  let selectionBox;
  let dragOrigin = null;
  let selectedCells = new Set();

  function overlaps(a, b) {
    return (
      a.left < b.right &&
      a.right > b.left &&
      a.top < b.bottom &&
      a.bottom > b.top
    );
  }

  function handleMouseDown(event) {
    if (event.button !== 0) return;
    dragOrigin = { x: event.pageX, y: event.pageY };
    selectedCells = new Set();
    selectionBox.style.display = 'block';
  }

  function handleMouseMove(event) {
    if (dragOrigin == null) return;

    selectionBox.style.left = Math.min(event.pageX, dragOrigin.x) + 'px';
    selectionBox.style.top = Math.min(event.pageY, dragOrigin.y) + 'px';
    selectionBox.style.width = Math.abs(event.pageX - dragOrigin.x) + 'px';
    selectionBox.style.height = Math.abs(event.pageY - dragOrigin.y) + 'px';

    const selectionRect = selectionBox.getBoundingClientRect();
    const next = new Set();
    dragArea.querySelectorAll('.grid__cell').forEach((cell, index) => {
      if (overlaps(selectionRect, cell.getBoundingClientRect())) {
        next.add(index);
      }
    });
    selectedCells = next;
  }

  function handleMouseUp() {
    dragOrigin = null;
    selectionBox?.removeAttribute('style');
  }
</script>

<svelte:window
  on:mousedown={handleMouseDown}
  on:mousemove={handleMouseMove}
  on:mouseup={handleMouseUp}
/>

<div bind:this={dragArea} class="draggable-area">
  <div bind:this={selectionBox} class="select-box" aria-hidden="true"></div>
  <div
    class="grid"
    role="grid"
    aria-label="Selectable cells"
    style="grid-template-columns: repeat({COLUMNS}, 1fr); grid-template-rows: repeat({ROWS}, 1fr);">
    {#each Array(ROWS * COLUMNS) as _, index}
      <div
        class:grid__cell--selected={selectedCells.has(index)}
        class="grid__cell"
        role="gridcell"
        aria-selected={selectedCells.has(index)}></div>
    {/each}
  </div>
</div>
