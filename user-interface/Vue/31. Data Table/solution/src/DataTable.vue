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

const totalPages = computed(() =>
  Math.ceil(props.data.length / pageSize.value),
);
const pageUsers = computed(() =>
  props.data.slice(
    (page.value - 1) * pageSize.value,
    page.value * pageSize.value,
  ),
);

function changePageSize() {
  page.value = 1;
}
</script>

<template>
  <table>
    <thead>
      <tr>
        <th v-for="column in columns" :key="column.key">
          {{ column.label }}
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
