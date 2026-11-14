<script setup>
import { computed, reactive, ref } from 'vue';

const props = defineProps({
  columns: {
    type: Array,
    required: true,
  },
  data: {
    type: Array,
    required: true,
  },
});

const pageSizes = [5, 10, 20];
const page = ref(1);
const pageSize = ref(5);
const sortField = ref(null);
const sortDirection = ref('asc');

const filteredData = computed(() => {
  return props.data;
});
const sortedData = computed(() => {
  const comparator = props.columns.find(
    (column) => column.key === sortField.value,
  )?.comparator;
  return comparator == null
    ? filteredData.value.slice()
    : filteredData.value
        .slice()
        .sort((a, b) => comparator(a, b, sortDirection.value));
});
const totalPages = computed(() =>
  Math.ceil(sortedData.value.length / pageSize.value),
);
const pageData = computed(() =>
  sortedData.value.slice(
    (page.value - 1) * pageSize.value,
    page.value * pageSize.value,
  ),
);

function sortBy(key) {
  if (sortField.value === key) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortField.value = key;
    sortDirection.value = 'asc';
  }
  page.value = 1;
}

function changePageSize() {
  page.value = 1;
}
</script>

<template>
  <table>
    <thead>
      <tr>
        <th v-for="column in columns" :key="column.key">
          <button type="button" @click="sortBy(column.key)">
            {{ column.label }}
          </button>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in pageData" :key="item.id">
        <td v-for="column in columns" :key="column.key">
          {{ column.renderCell(item) }}
        </td>
      </tr>
    </tbody>
  </table>

  <hr />

  <div class="pagination">
    <select
      v-model.number="pageSize"
      aria-label="Page size"
      @change="changePageSize">
      <option v-for="size in pageSizes" :key="size" :value="size">
        Show {{ size }}
      </option>
    </select>
    <div class="pages">
      <button type="button" :disabled="page <= 1" @click="page -= 1">
        Prev
      </button>
      <span v-if="totalPages === 0">0 pages</span>
      <span v-else aria-label="Page number">
        Page {{ page }} of {{ totalPages }}
      </span>
      <button
        type="button"
        :disabled="totalPages === 0 || page >= totalPages"
        @click="page += 1">
        Next
      </button>
    </div>
  </div>
</template>
