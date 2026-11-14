<script setup>
import { onUnmounted, ref } from 'vue';

const CONCURRENCY_LIMIT = 3;
const progression = ref([0]);
const timerId = ref(null);
const isProgressing = ref(false);

function stopTimer() {
  if (timerId.value != null) window.clearInterval(timerId.value);
  timerId.value = null;
}

function startTimer() {
  if (timerId.value != null) return;
  if (progression.value.every((value) => value >= 100)) return;

  timerId.value = window.setInterval(() => {
    const unfinished = progression.value
      .map((value, index) => ({ value, index }))
      .filter(({ value }) => value < 100)
      .slice(0, CONCURRENCY_LIMIT);

    if (unfinished.length === 0) {
      stopTimer();
      return;
    }

    const next = progression.value.slice();
    unfinished.forEach(({ index }) => {
      next[index] = Math.min(100, next[index] + 0.5);
    });
    progression.value = next;
  }, 10);
}

function start() {
  isProgressing.value = true;
  startTimer();
}

function pause() {
  isProgressing.value = false;
  stopTimer();
}

function appendBar() {
  progression.value.push(0);
  if (isProgressing.value) startTimer();
}

function reset() {
  pause();
  progression.value = [0];
}

onUnmounted(stopTimer);
</script>

<template>
  <div class="wrapper">
    <div class="buttons">
      <button type="button" @click="appendBar">Add</button>
      <button type="button" @click="isProgressing ? pause() : start()">
        {{ isProgressing ? 'Pause' : 'Start' }}
      </button>
      <button type="button" @click="reset">Reset</button>
    </div>
    <div class="bars">
      <div
        v-for="(progress, index) in progression"
        :key="index"
        class="bar"
        role="progressbar"
        aria-valuemin="0"
        aria-valuemax="100"
        :aria-valuenow="Math.floor(progress)">
        <div
          class="bar__fill"
          :style="{ transform: `scaleX(${progress / 100})` }"></div>
      </div>
    </div>
  </div>
</template>
