<script lang="ts">
  import { dev } from '$app/environment'
  import Lines from '$lib/components/Lines.svelte'
  import Mark from '$lib/components/Mark.svelte'
  import Stack from '$lib/components/Stack.svelte'
  import { getRandomCellCoordinates, type CellCoordinates, type Player } from '$lib/utils/board'
  import { delay } from '$lib/utils/promise'
  import { ProgressRadial } from '@skeletonlabs/skeleton'
  import { onMount, tick } from 'svelte'
  import { derived, writable, type Readable } from 'svelte/store'
  import { fade } from 'svelte/transition'
  import type { WorkerEventData, WorkerResponseData } from './AIFindBestMove.worker'
  import AIFindBestMoveWorker from './AIFindBestMove.worker?worker'
  import { getboardWinner, useUTTT } from './useUTTT'

  const aiFindBestMoveWorker = new AIFindBestMoveWorker()

  export async function workerAIFindBestMove(moves: CellCoordinates[], firstPlayer: Player) {
    const promise = new Promise((resolve, reject) => {
      aiFindBestMoveWorker.onmessage = (event) => resolve(event.data)
      aiFindBestMoveWorker.onerror = (error) => reject(error)
      const data: WorkerEventData = { moves, firstPlayer }
      aiFindBestMoveWorker.postMessage(JSON.stringify(data))
    })
    const resp = (await promise) as any
    return JSON.parse(resp) as WorkerResponseData
  }

  const AI_DEPTH = 4

  // prettier-ignore
  const GAME_ONGOING: CellCoordinates[] = [ [4, 4], [4, 0], [0, 8], [8, 0], [0, 0], [0, 1], [1, 6], [6, 1], [1, 2], [2, 2], [2, 5], [5, 2], [2, 3], [3, 3], [3, 2], [2, 4], [4, 6], [6, 2], [2, 8], [8, 2], [2, 7], [7, 3], [3, 0], [0, 4], [4, 2], [2, 6], ]
  // prettier-ignore
  const GAME_ALMOST_WON: CellCoordinates[] = [ [4, 4], [4, 0], [0, 8], [8, 0], [0, 0], [0, 1], [1, 6], [6, 1], [1, 2], [2, 2], [2, 5], [5, 2], [2, 3], [3, 3], [3, 2], [2, 4], [4, 6], [6, 2], [2, 8], [8, 2], [2, 7], [7, 3], [3, 0], [0, 4], [4, 2], [2, 6], [6, 0], [0, 7], [7, 5], [5, 1], [1, 4], [5, 0], [7, 7], [7, 6], [6, 6], [6, 7], [7, 4], [3, 6], [6, 3], [3, 7], ]
  // prettier-ignore
  const GAME_SLOW_COMPUTE: CellCoordinates[] = [[0,8],[8,0],[0,6],[6,1],[1,2],[2,1],[1,8],[8,2],[2,5],[5,2],[2,3],[3,3],[3,7],[7,3],[3,4],[4,4],[4,6],[6,4],[4,5],[5,4],[4,2],[2,4],[4,8],[8,1],[1,3],[3,1],[1,5],[5,3],[3,6],[6,7],[7,7],[7,2]]

  const {
    playMove,
    moves,
    firstPlayer,
    bigBoardWinner,
    bigBoard,
    allowedCells,
    allowedBoards,
    currentPlayer,
    resetGame,
    switchFirstPlayer,
  } = useUTTT()

  const onClick = async ([i, j]: CellCoordinates) => {
    if ($currentPlayer !== 'A') return
    playMove([i, j])

    await tick()
    if (dev) console.time('AIPlayBestMove')
    if ($bigBoardWinner) return
    const { data: bestMove, counter } = await workerAIFindBestMove($moves, $firstPlayer)
    if (bestMove) playMove(bestMove)
    if (dev) console.log(counter)
    if (dev) console.timeEnd('AIPlayBestMove')
  }

  const playerAMark = writable<'x' | 'o'>('x')
  const playerBMark: Readable<'x' | 'o'> = derived(playerAMark, ($playerAMark) =>
    $playerAMark === 'x' ? 'o' : 'x'
  )

  onMount(async () => {
    if ($firstPlayer !== 'B') return
    await delay(1000)
    playMove(getRandomCellCoordinates())
  })
</script>

{#if $bigBoardWinner}
  Winner: {$bigBoardWinner}

  <button
    class="btn variant-ghost-primary"
    on:click={async () => {
      resetGame()
      switchFirstPlayer()
      if ($firstPlayer !== 'B') return
      await delay(1000)
      playMove(getRandomCellCoordinates())
    }}
  >
    Play again
  </button>
{/if}

{#if dev}
  <div class="absolute opacity-10">
    {JSON.stringify($moves)}
  </div>
{/if}

<Stack>
  <Lines class="opacity-25" />

  <div class="grid grid-cols-3">
    {#each $bigBoard as smallBoard, i}
      <Stack class="p-[10%]">
        <Lines class="{$allowedBoards.includes(i) ? '' : 'opacity-10'} transition-opacity" />

        <div class="grid grid-cols-3" class:opacity-10={getboardWinner(smallBoard)}>
          {#each smallBoard as cell, j}
            <Stack>
              {#if cell}
                <div class:opacity-75={!$allowedBoards.includes(i)} in:fade={{ duration: 300 }}>
                  <Mark mark={cell === 'A' ? $playerAMark : $playerBMark} />
                </div>
              {:else}
                <button
                  disabled={!$allowedCells.find((ac) => ac?.length && ac[0] === i && ac[1] === j)}
                  class="aspect-square"
                  on:click={() => onClick([i, j])}
                />
              {/if}
            </Stack>
          {/each}
        </div>

        {#if getboardWinner(smallBoard)}
          <div class="grid place-items-center text-4xl">
            <Mark
              class=""
              mark={getboardWinner(smallBoard) === 'A' ? $playerAMark : $playerBMark}
            />
          </div>
        {/if}
      </Stack>
    {/each}
  </div>

  {#if $currentPlayer === 'B' && !$bigBoardWinner}
    <div class="grid place-items-center opacity-10">
      <ProgressRadial width="w-1/2" stroke={10} />
    </div>
  {/if}
</Stack>
