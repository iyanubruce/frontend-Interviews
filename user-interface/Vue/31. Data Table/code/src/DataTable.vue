<script setup>
defineProps({
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
      <tr v-for="user in data" :key="user.id">
        <td v-for="column in columns" :key="column.key">
          {{ user[column.key] }}
        </td>
      </tr>
    </tbody>
  </table>

  <!-- TODO: Add pagination state and controls. -->
</template>
