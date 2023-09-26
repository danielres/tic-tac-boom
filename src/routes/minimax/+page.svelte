<script lang="ts">
  import { tick } from 'svelte'
  import { getboardWinner, useUTTT, type CellCoordinates, type Player } from './utils'

  import AIFindBestMoveWorker from './AIFindBestMove.worker?worker'
  import type { WorkerResponseData } from './AIFindBestMove.worker'
  import Stack from '$lib/components/Stack.svelte'
  import { ProgressRadial } from '@skeletonlabs/skeleton'
  import Lines from '$lib/components/Lines.svelte'
  import Mark from '$lib/components/Mark.svelte'
  import { derived, writable, type Readable } from 'svelte/store'
  import { fade } from 'svelte/transition'

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

  // prettier-ignore
  const GAME_ONGOING: CellCoordinates[] = [ [4, 4], [4, 0], [0, 8], [8, 0], [0, 0], [0, 1], [1, 6], [6, 1], [1, 2], [2, 2], [2, 5], [5, 2], [2, 3], [3, 3], [3, 2], [2, 4], [4, 6], [6, 2], [2, 8], [8, 2], [2, 7], [7, 3], [3, 0], [0, 4], [4, 2], [2, 6], ]
  // prettier-ignore
  const GAME_ALMOST_WON: CellCoordinates[] = [ [4, 4], [4, 0], [0, 8], [8, 0], [0, 0], [0, 1], [1, 6], [6, 1], [1, 2], [2, 2], [2, 5], [5, 2], [2, 3], [3, 3], [3, 2], [2, 4], [4, 6], [6, 2], [2, 8], [8, 2], [2, 7], [7, 3], [3, 0], [0, 4], [4, 2], [2, 6], [6, 0], [0, 7], [7, 5], [5, 1], [1, 4], [5, 0], [7, 7], [7, 6], [6, 6], [6, 7], [7, 4], [3, 6], [6, 3], [3, 7], ]

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
    if ($bigBoardWinner) return
    console.time('AIPlayBestMove')
    const { data: bestMove, counter } = await workerAIFindBestMove(AI_DEPTH, $moves, $firstPlayer)
    if (bestMove) playMove(bestMove)
    console.log(counter)
    console.timeEnd('AIPlayBestMove')
  }

  const playerAMark = writable<'x' | 'o'>('x')
  const playerBMark: Readable<'x' | 'o'> = derived(playerAMark, ($playerAMark) =>
    $playerAMark === 'x' ? 'o' : 'x'
  )
</script>

{#if $bigBoardWinner}
  Winner: {$bigBoardWinner}
{/if}
<div class="absolute opacity-10">
  {JSON.stringify($moves)}
</div>
<Stack>
  <Lines class="opacity-25" />

  <div class="grid grid-cols-3">
    {#each $bigBoard as smallBoard, i}
      <Stack class="p-8">
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
              class="m-6"
              mark={getboardWinner(smallBoard) === 'A' ? $playerAMark : $playerBMark}
            />
          </div>
        {/if}
      </Stack>
    {/each}
  </div>

  {#if $currentPlayer === 'B' && !$bigBoardWinner}
    <div class="grid place-items-center opacity-5">
      <ProgressRadial width="w-96" stroke={10} />
    </div>
  {/if}
</Stack>
