<script setup>
const MIN = 0;
const MAX = 100;
const values = [0, 25, 50, 75, 100, 2, -10, 120];
const clamp = (value) => Math.min(Math.max(value, MIN), MAX);
</script>

<template>
  <div class="wrapper">
    <div v-for="value in values" :key="value" class="progress">
      <div
        class="progress-bar"
        :style="{ width: `${clamp(value)}%` }"
        role="progressbar"
        :aria-valuenow="clamp(value)"
        :aria-valuemin="MIN"
        :aria-valuemax="MAX">
        {{ clamp(value) }}%
      </div>
    </div>
  </div>
</template>
