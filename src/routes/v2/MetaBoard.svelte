<script lang="ts">
  import { derived, writable, type Writable } from 'svelte/store'

  type Player = 'X' | 'O'

  type Board = (undefined | Player)[]

  const wins = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]

  const metaboard: Writable<Board[]> = writable(
    Array.from({ length: 9 }).map(() => Array.from({ length: 9 }))
  )
  const player: Writable<Player> = writable('X')
  const moves: Writable<[Player, number, number][]> = writable([])
  const localWins = derived(metaboard, ($mb) => $mb.map((board) => getLocalWin(board)))
  const globalWin = derived(localWins, ($localWins) => getGlobalWin($localWins))

  const lastMove = derived(moves, ($moves) => $moves[$moves.length - 1])

  const currentBoard = derived([lastMove, localWins], ([$lastMove, $localWins]) => {
    if (!$lastMove) return undefined
    if ($localWins[$lastMove[2]]) return undefined
    return $lastMove[2]
  })

  function getLocalWin(board: Board): Player | undefined {
    for (const win of wins) {
      if (board[win[0]] && board[win[0]] === board[win[1]] && board[win[1]] === board[win[2]])
        return board[win[0]]
    }
    return undefined
  }

  function getGlobalWin(localWins: (Player | undefined)[]): Player | undefined {
    for (const win of wins) {
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
    if ($currentBoard !== undefined && $currentBoard !== board) return // If there's a currentBoard, ensure the clicked board is the correct one

    // Proceed with the move
    $metaboard[board][cell] = $player
    $player === 'X' ? ($player = 'O') : ($player = 'X')
    $moves = [...$moves, [$player, board, cell]]
  }
</script>

{#if $globalWin}
  <div class="globalWin">Winner: {$globalWin}</div>
{:else}
  <div class="currentPlayer">Player: {$player}</div>
{/if}

<div class="metaboard">
  {#each $metaboard as board, b}
    {#if $localWins[b]}
      <div class="localWin">{$localWins[b]}</div>
    {:else}
      <div class="stack p-4" class:current={$currentBoard === b}>
        <div class="flex justify-between">
          <div class="" />
          <div class="w-1 h-full bg-surface-700" />
          <div class="w-1 h-full bg-surface-700" />
          <div class="" />
        </div>
        <div class="flex justify-between rotate-90">
          <div class="" />
          <div class="w-1 h-full bg-surface-700" />
          <div class="w-1 h-full bg-surface-700" />
          <div class="" />
        </div>
        <div class="board" class:disabled={$currentBoard && $currentBoard !== b}>
          {#each board as cell, c}
            <button disabled={Boolean(cell)} class="cell" on:click={() => onClick(b, c)}>
              {cell ?? ''}
            </button>
          {/each}
        </div>
      </div>
    {/if}
  {/each}
</div>

<pre>{JSON.stringify($currentBoard)}</pre>
<pre>{JSON.stringify($lastMove)}</pre>
<pre>{JSON.stringify($localWins)}</pre>
<pre>{JSON.stringify($moves)}</pre>
<pre>{JSON.stringify($metaboard)}</pre>

<style lang="postcss">
  .metaboard {
    @apply grid grid-cols-3 gap-4;
  }
  .board {
    @apply relative; /* fix for rotate-90 bringing to front */
    @apply grid grid-cols-3;
  }
  .board.disabled {
    @apply pointer-events-none;
  }

  .current {
    @apply border-4 border-black/10 rounded-xl  bg-black/5;
  }

  .localWin {
    @apply grid place-items-center text-4xl;
  }
  .cell {
    @apply aspect-square grid place-items-center;
  }
  .stack {
    display: grid;
    grid-template-columns: 1fr;
  }
  .stack > * {
    grid-row-start: 1;
    grid-column-start: 1;
  }
</style>
