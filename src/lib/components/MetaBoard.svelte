<script lang="ts">
  import { derived, writable, type Readable, type Writable } from 'svelte/store'
  import Lines from './Lines.svelte'
  import Player from './Player.svelte'
  import Stack from './Stack.svelte'

  type Player = 'x' | 'o'
  type Board = (undefined | Player)[]
  type Move = [Player, number, number]

  //prettier-ignore
  const WINS = [ [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6], ]

  const moves: Writable<Move[]> = writable([])
  const movesUndone: Writable<Move[]> = writable([])

  const lastMove: Readable<Move> = derived(moves, ($moves) => $moves[$moves.length - 1])
  const turn: Readable<Player> = derived(moves, ($moves) => ($moves.length % 2 === 0 ? 'x' : 'o'))
  const metaboard: Readable<Board[]> = derived([moves], ([$moves]) => {
    const mb: Board[] = Array.from({ length: 9 }).map(() => Array.from({ length: 9 }))
    for (const move of $moves) mb[move[1]][move[2]] = move[0]
    return mb
  })

  const localWins = derived(metaboard, ($mb) => $mb.map((board) => getLocalWin(board)))
  const globalWin = derived(localWins, ($localWins) => getGlobalWin($localWins))
  const currentBoard = derived([lastMove, localWins], ([$lastMove, $localWins]) => {
    if (!$lastMove) return undefined
    if ($localWins[$lastMove[2]]) return undefined
    return $lastMove[2]
  })

  function getLocalWin(board: Board): Player | undefined {
    for (const win of WINS) {
      if (board[win[0]] && board[win[0]] === board[win[1]] && board[win[1]] === board[win[2]])
        return board[win[0]]
    }
    return undefined
  }

  function getGlobalWin(localWins: (Player | undefined)[]): Player | undefined {
    for (const win of WINS) {
      if (
        localWins[win[0]] &&
        localWins[win[0]] === localWins[win[1]] &&
        localWins[win[1]] === localWins[win[2]]
      )
        return localWins[win[0]]
    }
    return undefined
  }

  function onClick(board: number, cell: number) {
    if ($metaboard[board][cell]) return // Ensure the clicked cell is empty
    if ($localWins[board]) return // Ensure the clicked board is not won
    if ($currentBoard !== undefined && $currentBoard !== board) return // If there's a currentBoard, ensure the clicked board is the correct one
    $moves = [...$moves, [$turn, board, cell]]
    $movesUndone = []
  }

  function reset() {
    $moves = []
    $movesUndone = []
  }

  function undo() {
    if (!$moves.length) return
    const undone = $moves[$moves.length - 1]
    $movesUndone = [...$movesUndone, undone]
    $moves = $moves.slice(0, -1)
  }

  function redo() {
    if (!$movesUndone.length) return
    $moves = [...$moves, $movesUndone[$movesUndone.length - 1]]
    $movesUndone = $movesUndone.slice(0, -1)
  }

  function loadGame() {
    // prettier-ignore
    $moves = [["o",4,4],["x",4,7],["o",7,5],["x",5,3],["o",3,5],["x",5,4],["o",4,8],["x",8,3],["o",3,4],["x",4,0],["o",0,4],["x",4,2],["o",2,5],["x",5,5],["o",3,3],["x",4,1],["o",1,7],["x",7,8],["o",8,8],["x",8,2],["o",2,6],["x",6,4],["o",6,5],["x",7,4],["o",7,0],["x",0,8],["o",8,0],["x",0,6],["o",6,8],["x",8,6],["o",6,2],["x",2,4],["o",7,1],["x",1,4],["o",7,2],["x",2,7]]
    $movesUndone = []
  }
</script>

<div class="flex gap-2 mb-4">
  <button class="btn variant-ghost-surface" on:click={loadGame}>Load</button>
  <button class="btn variant-ghost-surface" on:click={reset}>Reset</button>
  <button class="btn variant-ghost-surface" on:click={undo} disabled={!$moves.length}>Undo</button>
  <button class="btn variant-ghost-surface" on:click={redo} disabled={!$movesUndone.length}>
    Redo
  </button>
  {#if $globalWin}
    <div class="ml-auto flex variant-ghost-success place-items-center px-4 gap-4">
      <div class="text-success-300">Winner:</div>
      <Player player={$globalWin} class="h-6 text-success-100" />
    </div>
  {/if}
</div>

<Stack>
  <Lines class="opacity-20" />

  <div class="metaboard">
    {#each $metaboard as board, boardIdx}
      {@const dimmed = $globalWin || ($currentBoard !== undefined && $currentBoard !== boardIdx)}

      <Stack class="p-4">
        <Stack class={$localWins[boardIdx] ? 'opacity-20' : ''}>
          <Lines class={dimmed ? 'opacity-40' : ''} />

          <div class="board relative">
            {#each board as cell, cellIdx}
              {#if cell}
                <div class="cell">
                  <Player player={cell} />
                </div>
              {:else if dimmed || $globalWin}
                <div class="cell" />
              {:else}
                <button
                  class="cell opacity-0 hover:opacity-60"
                  on:click={() => onClick(boardIdx, cellIdx)}
                >
                  <Player player={$turn} />
                </button>
              {/if}
            {/each}
          </div>
        </Stack>

        {#if $localWins[boardIdx]}
          <div class="localWin">
            <Player player={$localWins[boardIdx]} />
          </div>
        {/if}
      </Stack>
    {/each}
  </div>
</Stack>

<style lang="postcss">
  .metaboard {
    @apply grid grid-cols-3 gap-4;
  }
  .board {
    @apply relative; /* fix for rotate-90 bringing to front */
    @apply grid grid-cols-3;
  }
  .cell {
    @apply aspect-square grid place-items-center;
  }
  .localWin {
    @apply relative; /* fix for rotate-90 bringing to front */
    @apply grid place-items-center text-8xl;
  }
</style>