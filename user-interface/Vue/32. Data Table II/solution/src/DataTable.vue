<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
});

const columns = [
  { label: 'ID', key: 'id' },
  { label: 'Name', key: 'name' },
  { label: 'Age', key: 'age' },
  { label: 'Occupation', key: 'occupation' },
];
const pageSizes = [5, 10, 20];

const page = ref(1);
const pageSize = ref(5);
const sortField = ref(null);
const sortDirection = ref('asc');

const sortedUsers = computed(() => {
  if (sortField.value == null) {
    return props.data.slice();
  }

  return props.data.slice().sort((a, b) => {
    const result =
      typeof a[sortField.value] === 'number'
        ? a[sortField.value] - b[sortField.value]
        : a[sortField.value].localeCompare(b[sortField.value]);
    return sortDirection.value === 'asc' ? result : -result;
  });
});
const totalPages = computed(() =>
  Math.ceil(sortedUsers.value.length / pageSize.value),
);
const pageUsers = computed(() =>
  sortedUsers.value.slice(
    (page.value - 1) * pageSize.value,
    page.value * pageSize.value,
  ),
);

function changePageSize() {
  page.value = 1;
}

function sortBy(key) {
  if (sortField.value === key) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortField.value = key;
    sortDirection.value = 'asc';
  }
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
      <tr v-for="user in pageUsers" :key="user.id">
        <td v-for="column in columns" :key="column.key">
          {{ user[column.key] }}
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
      <button type="button" :disabled="page === 1" @click="page -= 1">
        Prev
      </button>
      <span aria-label="Page number">Page {{ page }} of {{ totalPages }}</span>
      <button type="button" :disabled="page === totalPages" @click="page += 1">
        Next
      </button>
    </div>
  </div>
</template>
