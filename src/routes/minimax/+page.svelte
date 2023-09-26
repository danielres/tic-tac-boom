<script lang="ts">
  import { tick } from 'svelte'
  import { getboardWinner, useUTTT, type CellCoordinates, type Player } from './utils'

  import AIFindBestMoveWorker from './AIFindBestMove.worker?worker'
  import type { WorkerResponseData } from './AIFindBestMove.worker'

  const aiFindBestMoveWorker = new AIFindBestMoveWorker()

  export async function workerAIFindBestMove(
    aiDepth: number,
    moves: CellCoordinates[],
    firstPlayer: Player
  ) {
    const promise = new Promise((resolve, reject) => {
      aiFindBestMoveWorker.onmessage = (event) => resolve(event.data)
      aiFindBestMoveWorker.onerror = (error) => reject(error)
      aiFindBestMoveWorker.postMessage(JSON.stringify({ aiDepth, moves, firstPlayer }))
    })
    const resp = (await promise) as any
    return JSON.parse(resp) as WorkerResponseData
  }

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
