<script setup>
import { ref } from 'vue';

const count = ref(0);
</script>

<template>
  <div class="wrapper">
    <div><button type="button" @click="count += 1">Add</button></div>
    <div class="bars">
      <div v-for="index in count" :key="index" class="bar">
        <div class="bar__fill"></div>
      </div>
    </div>
  </div>
</template>
