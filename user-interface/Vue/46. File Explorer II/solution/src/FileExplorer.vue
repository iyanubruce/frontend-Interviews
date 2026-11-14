<script setup>
import { computed } from 'vue';

import FileItem from './FileItem.vue';

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
});

function sortItems(items) {
  const directories = items
    .filter((item) => Array.isArray(item.children))
    .sort((a, b) => a.name.localeCompare(b.name));
  const files = items
    .filter((item) => !Array.isArray(item.children))
    .sort((a, b) => a.name.localeCompare(b.name));
  return [...directories, ...files];
}

const items = computed(() => sortItems(props.data));
</script>

<template>
  <div aria-label="Files Explorer" role="tree">
    <ul class="file-list" role="group">
      <FileItem
        v-for="(file, index) in items"
        :key="'root-' + index"
        :file="file"
        :level="1"
        :path="'root-' + index"
        :pos-in-set="index + 1"
        :set-size="items.length" />
    </ul>
  </div>
</template>
