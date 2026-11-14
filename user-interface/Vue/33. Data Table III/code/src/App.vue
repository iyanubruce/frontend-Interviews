<script setup>
import DataTable from './DataTable.vue';
import users from './data/users';
</script>

<template>
  <DataTable :data="users" />
</template>
