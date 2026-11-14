<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { COLORS, Color, Mode } from './colors';
const props = defineProps<{
  mode: Mode;
  selectedColor: Color;
  initialRows: number;
  initialColumns: number;
}>();

const grid = ref<(Color | null)[][]>(
  Array.from({ length: props.initialRows }, () =>
    Array(props.initialColumns).fill(null),
  ),
);

const isDragging = ref(false);

function mark(rowIndex: number, cellIndex: number) {
  grid.value[rowIndex][cellIndex] =
    props.mode === 'erase' ? null : props.selectedColor;
}

function startDragging(
  event: PointerEvent,
  rowIndex: number,
  cellIndex: number,
) {
  if (event.button !== 0) {
    return;
  }

  isDragging.value = true;
  mark(rowIndex, cellIndex);
}

function endDragging() {
  isDragging.value = false;
}

onMounted(() => {
  window.addEventListener('pointerup', endDragging);
  window.addEventListener('pointercancel', endDragging);
  window.addEventListener('blur', endDragging);
});

onUnmounted(() => {
  window.removeEventListener('pointerup', endDragging);
  window.removeEventListener('pointercancel', endDragging);
  window.removeEventListener('blur', endDragging);
});
</script>

<template>
  <div class="grid" aria-label="Pixel art canvas" role="group">
    <div
      v-for="(row, rowIndex) in grid"
      :class="[
        'grid__row',
        rowIndex % 2 === 0 ? 'grid__row--even' : 'grid__row--odd',
      ]"
      :key="rowIndex">
      <button
        v-for="(cellColor, cellIndex) in row"
        :key="cellIndex"
        :aria-label="`Pixel row ${rowIndex + 1}, column ${cellIndex + 1}, ${
          cellColor ?? 'empty'
        }`"
        :aria-pressed="cellColor != null"
        @click="mark(rowIndex, cellIndex)"
        @pointerdown="startDragging($event, rowIndex, cellIndex)"
        @pointerenter="
          () => {
            if (isDragging) {
              mark(rowIndex, cellIndex);
            }
          }
        "
        :style="{
          'background-color': cellColor != null ? COLORS[cellColor] : undefined,
        }"
        class="grid__cell"
        type="button" />
    </div>
  </div>
</template>

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
