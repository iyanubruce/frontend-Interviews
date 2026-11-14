<script setup>
import { ref } from 'vue';

const CONCURRENCY_LIMIT = 3;
const bars = ref([]);

function add() {
  const canStart =
    bars.value.filter((status) => status === 'running').length <
    CONCURRENCY_LIMIT;
  bars.value.push(canStart ? 'running' : 'waiting');
}

function complete(index) {
  if (bars.value[index] !== 'running') return;
  bars.value[index] = 'complete';

  while (
    bars.value.filter((status) => status === 'running').length <
    CONCURRENCY_LIMIT
  ) {
    const waitingIndex = bars.value.indexOf('waiting');
    if (waitingIndex === -1) break;
    bars.value[waitingIndex] = 'running';
  }
}
</script>

<template>
  <div class="wrapper">
    <div><button type="button" @click="add">Add</button></div>
    <div class="bars">
      <div v-for="(status, index) in bars" :key="index" class="bar">
        <div
          class="bar__fill"
          :class="{
            'bar__fill--running': status === 'running',
            'bar__fill--complete': status === 'complete',
          }"
          @animationend="complete(index)"></div>
      </div>
    </div>
  </div>
</template>
