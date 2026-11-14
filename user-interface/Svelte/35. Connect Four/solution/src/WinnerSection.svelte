<script>
  import { PLAYER_TOKENS } from './const';
  export let winner;
</script>

<div
  class="winner-token"
  role="status"
  style:background-color={PLAYER_TOKENS[winner]}>
  {winner.toUpperCase()} WON
</div>

<style>
  .winner-token {
    height: var(--grid-item-size);
    min-width: var(--grid-item-size);
    border-radius: 9999px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 12px;
    font-weight: 600;
    padding-inline: 8px;
  }
</style>
