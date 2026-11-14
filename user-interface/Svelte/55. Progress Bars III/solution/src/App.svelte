<script>
  const CONCURRENCY_LIMIT = 3;
  let bars = [];

  function add() {
    const canStart =
      bars.filter((status) => status === 'running').length <
      CONCURRENCY_LIMIT;
    bars = [...bars, canStart ? 'running' : 'waiting'];
  }

  function complete(index) {
    if (bars[index] !== 'running') return;
    const next = bars.slice();
    next[index] = 'complete';

    while (
      next.filter((status) => status === 'running').length <
      CONCURRENCY_LIMIT
    ) {
      const waitingIndex = next.indexOf('waiting');
      if (waitingIndex === -1) break;
      next[waitingIndex] = 'running';
    }
    bars = next;
  }
</script>

<div class="wrapper">
  <div><button type="button" on:click={add}>Add</button></div>
  <div class="bars">
    {#each bars as status, index (index)}
      <div class="bar">
        <div
          class:bar__fill--running={status === 'running'}
          class:bar__fill--complete={status === 'complete'}
          class="bar__fill"
          on:animationend={() => complete(index)}></div>
      </div>
    {/each}
  </div>
</div>

