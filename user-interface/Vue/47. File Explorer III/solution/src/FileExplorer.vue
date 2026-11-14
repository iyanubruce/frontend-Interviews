<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
});

const expandedPaths = ref(new Set());

function sortItems(items) {
  const directories = items
    .filter((item) => Array.isArray(item.children))
    .sort((a, b) => a.name.localeCompare(b.name));
  const files = items
    .filter((item) => !Array.isArray(item.children))
    .sort((a, b) => a.name.localeCompare(b.name));
  return [...directories, ...files];
}

function flatten(items, level, parentPath) {
  const rows = [];
  sortItems(items).forEach((file, index) => {
    const path = parentPath + '-' + index;
    rows.push({ file, level, path });
    if (Array.isArray(file.children) && expandedPaths.value.has(path)) {
      rows.push(...flatten(file.children, level + 1, path));
    }
  });
  return rows;
}

function toggle(path) {
  const next = new Set(expandedPaths.value);
  if (next.has(path)) {
    next.delete(path);
  } else {
    next.add(path);
  }
  expandedPaths.value = next;
}

const rows = computed(() => flatten(props.data, 1, 'root'));
</script>

<template>
  <ul class="file-list">
    <li
      v-for="row in rows"
      :key="row.path"
      class="file-item"
      :style="{ paddingLeft: (row.level - 1) * 16 + 'px' }">
      <button
        v-if="Array.isArray(row.file.children)"
        type="button"
        class="file-item-button file-item-button--directory"
        @click="toggle(row.path)">
        <span>{{ row.file.name }}</span>
        [{{ expandedPaths.has(row.path) ? '-' : '+' }}]
      </button>
      <span v-else class="file-item-button">{{ row.file.name }}</span>
    </li>
  </ul>
</template>
