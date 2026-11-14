<script setup>
import { ref } from 'vue';

const props = defineProps({
  max: Number,
  modelValue: Number,
});

const emit = defineEmits(['update:modelValue']);

const hoveredIndex = ref(null);

function checkStarFilled(index) {
  if (hoveredIndex.value != null) {
    return index <= hoveredIndex.value;
  }

  return index < props.modelValue;
}
</script>

<template>
  <div
    aria-label="Star rating"
    class="star-rating"
    role="group"
    @mouseleave="hoveredIndex = null">
    <button
      v-for="(_, index) in max"
      :key="index"
      :aria-label="`Rate ${index + 1} stars`"
      :aria-pressed="modelValue === index + 1"
      class="star-button"
      type="button"
      @blur="hoveredIndex = null"
      @focus="hoveredIndex = index"
      @mouseenter="hoveredIndex = index"
      @click="$emit('update:modelValue', index + 1)">
      <svg
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        :class="['star-icon', checkStarFilled(index) && 'star-icon-filled']"
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
  </div>
</template>

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
  --icon-size: 32px;

  height: var(--icon-size);
  width: var(--icon-size);
}

.star-icon-filled {
  fill: yellow;
}
</style>
