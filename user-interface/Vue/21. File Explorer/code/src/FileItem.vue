<script setup>
import { computed } from 'vue';

const props = defineProps({
  file: {
    type: Object,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  posInSet: {
    type: Number,
    required: true,
  },
  setSize: {
    type: Number,
    required: true,
  },
});

const isDirectory = computed(() => Array.isArray(props.file.children));
</script>

<template>
  <li class="file-item">
    <button
      type="button"
      class="file-item-button"
      :class="{ 'file-item-button--directory': isDirectory }">
      <span>{{ file.name }}</span>
    </button>
    <!-- TODO: Render nested children and add directory expansion. -->
  </li>
</template>
