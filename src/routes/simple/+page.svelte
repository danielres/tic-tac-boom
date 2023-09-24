<script lang="ts">
  import { derived, writable, type Readable, type Writable } from 'svelte/store'

  const WINS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]

  type Player = 'p1' | 'p2'
  type Cell = number
  type Board = Array<Player | null>

  const moves: Writable<{ player: Player; cell: Cell }[]> = writable([])

  const board: Readable<Board> = derived(moves, ($moves) => {
    const board = Array(9).fill(null)
    $moves.forEach((move) => {
      board[move.cell] = move.player
    })
    return board
  })

  const currentPlayer: Readable<Player> = derived(moves, ($moves) =>
    $moves[$moves.length - 1]?.player === 'p1' ? 'p2' : 'p1' ?? 'p1'
  )

  const winner: Readable<Player | null> = derived(board, ($board) => {
    const winner = WINS.find((win) => {
      const [a, b, c] = win
      return $board[a] && $board[a] === $board[b] && $board[a] === $board[c]
    })
    return winner ? $board[winner[0]] : null
  })

  const isGameDraw: Readable<boolean> = derived([board, winner], ([$board, $winner]) => {
    return !$winner && $board.every((cell) => cell !== null)
  })

  function checkWin(board: Board, player: Player) {
    const winner = WINS.find((win) => {
      const [a, b, c] = win
      return board[a] && board[a] === board[b] && board[a] === board[c]
    })
    return winner ? board[winner[0]] === player : null
  }

  function checkDraw(board: Board): boolean {
    return board.every((cell) => cell !== null)
  }

  function evaluateGame(board: Board) {
    //minimax code:

    //base case
    if (checkWin(board, 'p1')) return { score: -10 }
    if (checkWin(board, 'p2')) return { score: 10 }
    if (checkDraw(board)) return { score: 0 }
  }
</script>

{#if $winner}
  <div>Winner: {$winner}</div>
  <button class="btn variant-ghost" on:click={() => ($moves = [])}>Reset</button>
{:else if $isGameDraw}
  <div>Draw</div>
  <button class="btn variant-ghost" on:click={() => ($moves = [])}>Reset</button>
{/if}

<div class="max-w-xl mx-auto">
  <div class="grid grid-cols-3">
    {#each Array(9) as _, i}
      <button
        disabled={!!$board[i] || !!$winner || $isGameDraw}
        class="aspect-square border"
        on:click={() => {
          $moves = [...$moves, { player: $currentPlayer, cell: i }]
        }}
      >
        {#if $board[i] === 'p1'}
          X
        {:else if $board[i] === 'p2'}
          Y
        {/if}
      </button>
    {/each}
  </div>
</div>
