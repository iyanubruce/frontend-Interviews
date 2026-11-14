<script>
  const MIN = 0;
  const MAX = 100;
  const values = [0, 25, 50, 75, 100, 2, -10, 120];
  const clamp = (value) => Math.min(Math.max(value, MIN), MAX);
</script>

<div class="wrapper">
  {#each values as value}
    {@const clampedValue = clamp(value)}
    <div class="progress">
      <div
        class="progress-bar"
        style="width: {clampedValue}%"
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={MIN}
        aria-valuemax={MAX}>
        {clampedValue}%
      </div>
    </div>
  {/each}
</div>

