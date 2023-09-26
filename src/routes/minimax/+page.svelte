<script lang="ts">
  import { tick } from 'svelte'
  import { getboardWinner, useUTTT, type CellCoordinates } from './utils'
  import { workerAIFindBestMove } from './AIFindBestMove.worker'

  const AI_DEPTH = 4

  const {
    playMove,
    moves,
    firstPlayer,
    bigBoardWinner,
    bigBoard,
    allowedCells,
    allowedBoards,
    currentPlayer,
  } = useUTTT()

  const onClick = async ([i, j]: CellCoordinates) => {
    if ($currentPlayer !== 'A') return
    playMove([i, j])
    await tick()

    console.time('AIPlayBestMove')
    const { data: bestMove, counter } = await workerAIFindBestMove(AI_DEPTH, $moves, $firstPlayer)
    if (bestMove) playMove(bestMove)
    console.log(counter)
    console.timeEnd('AIPlayBestMove')
  }
</script>

{#if $bigBoardWinner}
  Winner: {$bigBoardWinner}
{/if}

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
