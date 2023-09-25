<script lang="ts">
  import { tick } from 'svelte'
  import { AIFindBestMove, getboardWinner, useUTTT, type CellCoordinates } from './utils'

  const AI_DEPTH = 4

  const {
    playMove,
    moves,
    firstPlayer,
    counter,
    bigBoardWinner,
    bigBoard,
    allowedCells,
    allowedBoards,
  } = useUTTT()

  const onClick = async ([i, j]: CellCoordinates) => {
    playMove([i, j])
    await tick()
    console.time('AIPlayBestMove')
    $counter = 0
    const bestMove = AIFindBestMove(AI_DEPTH, $moves, $firstPlayer, counter)
    if (bestMove) playMove(bestMove)
    console.timeEnd('AIPlayBestMove')
  }
</script>

{#if $bigBoardWinner}
  Winner: {$bigBoardWinner}
{/if}
{$counter}

<div class="grid grid-cols-3 gap-8">
  {#each $bigBoard as smallBoard, i}
    {#if getboardWinner(smallBoard)}
      <div class:variant-ghost={$allowedBoards.includes(i)}>{getboardWinner(smallBoard)}</div>
    {:else}
      <div class="grid grid-cols-3" class:variant-ghost={$allowedBoards.includes(i)}>
        {#each smallBoard as cell, j}
          <button
            disabled={!$allowedCells.find((ac) => ac?.length && ac[0] === i && ac[1] === j)}
            class="aspect-square"
            on:click={() => onClick([i, j])}
          >
            {cell || '-'}
          </button>
        {/each}
      </div>
    {/if}
  {/each}
</div>
