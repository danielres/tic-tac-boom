<script lang="ts">
  export let state
  export let turn
  export let lastCoord
  export let index: number
  export let disabled: boolean

  function onClick(coord: [number, number, number]) {
    $state[coord[0]][coord[1]][coord[2]] = $turn
    $lastCoord = coord
    $turn === 'X' ? ($turn = 'O') : ($turn = 'X')
  }
</script>

{disabled}
<div class="board" class:disabled>
  <div class="row">
    <button class="cell" on:click={() => onClick([index, 0, 0])}>
      {$state[index][0][0] ?? ''}
    </button>
    <button class="cell border-l" on:click={() => onClick([index, 0, 1])}>
      {$state[index][0][1] ?? ''}
    </button>
    <button class="cell border-l" on:click={() => onClick([index, 0, 2])}>
      {$state[index][0][2] ?? ''}
    </button>
  </div>

  <div class="row border-t">
    <button class="cell" on:click={() => onClick([index, 1, 0])}>
      {$state[index][1][0] ?? ''}
    </button>
    <button class="cell border-l" on:click={() => onClick([index, 1, 1])}>
      {$state[index][1][1] ?? ''}
    </button>
    <button class="cell border-l" on:click={() => onClick([index, 1, 2])}>
      {$state[index][1][2] ?? ''}
    </button>
  </div>

  <div class="row border-t">
    <button class="cell" on:click={() => onClick([index, 2, 0])}>
      {$state[index][2][0] ?? ''}
    </button>
    <button class="cell border-l" on:click={() => onClick([index, 2, 1])}>
      {$state[index][2][1] ?? ''}
    </button>
    <button class="cell border-l" on:click={() => onClick([index, 2, 2])}>
      {$state[index][2][2] ?? ''}
    </button>
  </div>
</div>

<style lang="postcss">
  .board {
  }

  .board.disabled {
    @apply opacity-25 pointer-events-none;
  }

  .row {
    @apply grid grid-cols-3;
  }
  .cell {
    @apply aspect-square grid place-items-center;
  }
</style>
