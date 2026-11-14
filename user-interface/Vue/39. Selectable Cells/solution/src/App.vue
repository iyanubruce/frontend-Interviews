<script setup>
import { onMounted, onUnmounted, ref } from 'vue';

const ROWS = 10;
const COLUMNS = 10;
const cells = Array(ROWS * COLUMNS).fill(null);

const dragArea = ref(null);
const selectionBox = ref(null);
const dragOrigin = ref(null);
const selectedCells = ref(new Set());

function overlaps(a, b) {
  return (
    a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top
  );
}

function handleMouseDown(event) {
  if (event.button !== 0) return;
  dragOrigin.value = { x: event.pageX, y: event.pageY };
  selectedCells.value = new Set();
  selectionBox.value.style.display = 'block';
}

function handleMouseMove(event) {
  if (dragOrigin.value == null) return;
  const box = selectionBox.value;

  box.style.left = Math.min(event.pageX, dragOrigin.value.x) + 'px';
  box.style.top = Math.min(event.pageY, dragOrigin.value.y) + 'px';
  box.style.width = Math.abs(event.pageX - dragOrigin.value.x) + 'px';
  box.style.height = Math.abs(event.pageY - dragOrigin.value.y) + 'px';

  const boxRect = box.getBoundingClientRect();
  const next = new Set();
  dragArea.value.querySelectorAll('.grid__cell').forEach((cell, index) => {
    if (overlaps(boxRect, cell.getBoundingClientRect())) next.add(index);
  });
  selectedCells.value = next;
}

function handleMouseUp() {
  dragOrigin.value = null;
  selectionBox.value?.removeAttribute('style');
}

onMounted(() => {
  window.addEventListener('mousedown', handleMouseDown);
  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('mouseup', handleMouseUp);
});

onUnmounted(() => {
  window.removeEventListener('mousedown', handleMouseDown);
  window.removeEventListener('mousemove', handleMouseMove);
  window.removeEventListener('mouseup', handleMouseUp);
});
</script>

<template>
  <div ref="dragArea" class="draggable-area">
    <div ref="selectionBox" class="select-box" aria-hidden="true"></div>
    <div
      class="grid"
      role="grid"
      aria-label="Selectable cells"
      :style="{
        gridTemplateColumns: `repeat(${COLUMNS}, 1fr)`,
        gridTemplateRows: `repeat(${ROWS}, 1fr)`,
      }">
      <div
        v-for="(_, index) in cells"
        :key="index"
        class="grid__cell"
        :class="{ 'grid__cell--selected': selectedCells.has(index) }"
        role="gridcell"
        :aria-selected="selectedCells.has(index)"></div>
    </div>
  </div>
</template>
