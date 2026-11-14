<script>
  import { onDestroy } from 'svelte';

  const CONCURRENCY_LIMIT = 3;
  let progression = [0];
  let timerId = null;
  let isProgressing = false;

  function stopTimer() {
    if (timerId != null) window.clearInterval(timerId);
    timerId = null;
  }

  function startTimer() {
    if (timerId != null) return;
    if (progression.every((value) => value >= 100)) return;

    timerId = window.setInterval(() => {
      const unfinished = progression
        .map((value, index) => ({ value, index }))
        .filter(({ value }) => value < 100)
        .slice(0, CONCURRENCY_LIMIT);

      if (unfinished.length === 0) {
        stopTimer();
        return;
      }

      const next = progression.slice();
      unfinished.forEach(({ index }) => {
        next[index] = Math.min(100, next[index] + 0.5);
      });
      progression = next;
    }, 10);
  }

  function start() {
    isProgressing = true;
    startTimer();
  }

  function pause() {
    isProgressing = false;
    stopTimer();
  }

  function appendBar() {
    progression = [...progression, 0];
    if (isProgressing) startTimer();
  }

  function reset() {
    pause();
    progression = [0];
  }

  onDestroy(stopTimer);
</script>

<div class="wrapper">
  <div class="buttons">
    <button type="button" on:click={appendBar}>
      Add
    </button>
    <button type="button" on:click={() => (isProgressing ? pause() : start())}>
      {isProgressing ? 'Pause' : 'Start'}
    </button>
    <button type="button" on:click={reset}>Reset</button>
  </div>
  <div class="bars">
    {#each progression as progress}
      <div
        class="bar"
        role="progressbar"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow={Math.floor(progress)}>
        <div
          class="bar__fill"
          style="transform: scaleX({progress / 100})"></div>
      </div>
    {/each}
  </div>
</div>
