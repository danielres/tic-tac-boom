<script lang="ts">
  type Board = string[][]

  let board: Board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
  ]

  function isTerminal(board: Board): boolean {
    for (let i = 0; i < 3; i++) {
      if (board[i][0] && board[i][0] === board[i][1] && board[i][0] === board[i][2]) return true
      if (board[0][i] && board[0][i] === board[1][i] && board[0][i] === board[2][i]) return true
    }
    if (board[0][0] && board[0][0] === board[1][1] && board[0][0] === board[2][2]) return true
    if (board[0][2] && board[0][2] === board[1][1] && board[0][2] === board[2][0]) return true

    return board.flat().every((cell) => cell) // Check for draw
  }

  function minimax(board: Board, depth: number, isMaximizing: boolean, maxDepth = 3) {
    console.log(depth)

    if (isTerminal(board) || depth == maxDepth) {
      if (isMaximizing) return -10 + depth
      else return 10 - depth
    }

    if (isMaximizing) {
      let maxEval = -Infinity
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (!board[i][j]) {
            board[i][j] = 'O'
            let evaluation = minimax(board, depth + 1, false, maxDepth)
            board[i][j] = ''
            maxEval = Math.max(maxEval, evaluation)
          }
        }
      }
      return maxEval
    } else {
      let minEval = Infinity
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (!board[i][j]) {
            board[i][j] = 'X'
            let evaluation = minimax(board, depth + 1, true, maxDepth)
            board[i][j] = ''
            minEval = Math.min(minEval, evaluation)
          }
        }
      }
      return minEval
    }
  }

  function bestMove() {
    let bestValue = -Infinity
    let move = { x: -1, y: -1 }

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (!board[i][j]) {
          board[i][j] = 'O'
          let moveValue = minimax(board, 0, false)
          board[i][j] = ''

          if (moveValue > bestValue) {
            bestValue = moveValue
            move = { x: i, y: j }
          }
        }
      }
    }
    return move
  }

  // Sample usage:
  // Make your move on the board, then call `bestMove()` to get AI's best move.
  // Apply the AI move to the board and continue playing.

  // your script goes here
</script>

<pre>{JSON.stringify(board, null, 2)}</pre>

<div class="grid grid-cols-3 max-w-xs mx-auto">
  {#each board as row, i}
    {#each row as cell, j}
      <button
        class="btn border aspect-square"
        on:click={() => {
          if (board[i][j]) return
          if (isTerminal(board)) return
          board[i][j] = 'X'
          const { x, y } = bestMove()
          board[x][y] = 'O'
        }}
      >
        {cell}
      </button>
    {/each}
  {/each}
</div>
