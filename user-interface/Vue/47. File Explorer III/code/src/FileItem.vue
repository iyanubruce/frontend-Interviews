<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
  file: {
    type: Object,
    required: true,
  },
  level: {
    type: Number,
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
const expanded = ref(false);

const children = computed(() => {
  const items = props.file.children ?? [];
  const directories = items
    .filter((child) => Array.isArray(child.children))
    .sort((a, b) => a.name.localeCompare(b.name));
  const files = items
    .filter((child) => !Array.isArray(child.children))
    .sort((a, b) => a.name.localeCompare(b.name));
  return [...directories, ...files];
});

function toggle() {
  if (isDirectory.value) {
    expanded.value = !expanded.value;
  }
}
</script>

<template>
  <li class="file-item">
    <button
      v-if="isDirectory"
      type="button"
      class="file-item-button file-item-button--directory"
      @click="toggle">
      <span>{{ file.name }}</span>
      [{{ expanded ? '-' : '+' }}]
    </button>
    <span v-else class="file-item-button">{{ file.name }}</span>
    <ul
      v-if="isDirectory && file.children.length > 0 && expanded"
      class="file-list">
      <FileItem
        v-for="(child, index) in children"
        :key="path + '-' + index"
        :file="child"
        :level="level + 1"
        :path="path + '-' + index"
        :pos-in-set="index + 1"
        :set-size="children.length" />
    </ul>
  </li>
</template>
