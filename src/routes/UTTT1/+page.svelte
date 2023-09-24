<script lang="ts">
  type SmallBoard = string[][]
  type BigBoard = SmallBoard[][]

  let board: BigBoard = Array(3)
    .fill(0)
    .map((_) =>
      Array(3)
        .fill(0)
        .map((_) => [
          ['', '', ''],
          ['', '', ''],
          ['', '', ''],
        ])
    )

  function isSmallBoardTerminal(b: SmallBoard): boolean {
    // Check rows, columns and diagonals for a win
    for (let i = 0; i < 3; i++) {
      if (b[i][0] && b[i][0] === b[i][1] && b[i][0] === b[i][2]) return true
      if (b[0][i] && b[0][i] === b[1][i] && b[0][i] === b[2][i]) return true
    }
    if (b[0][0] && b[0][0] === b[1][1] && b[0][0] === b[2][2]) return true
    if (b[0][2] && b[0][2] === b[1][1] && b[0][2] === b[2][0]) return true

    // Check for a draw (all cells filled)
    if (b.flat().every((cell) => cell !== '')) return true

    // If none of the above conditions are met, the board is not terminal
    return false
  }

  // Helper function to determine the winner of a small board
  function winnerOfSmallBoard(b: SmallBoard): string | null {
    for (let i = 0; i < 3; i++) {
      if (b[i][0] && b[i][0] === b[i][1] && b[i][0] === b[i][2]) return b[i][0]
      if (b[0][i] && b[0][i] === b[1][i] && b[0][i] === b[2][i]) return b[0][i]
    }
    if (b[0][0] && b[0][0] === b[1][1] && b[0][0] === b[2][2]) return b[0][0]
    if (b[0][2] && b[0][2] === b[1][1] && b[0][2] === b[2][0]) return b[0][2]
    return null // No winner for this small board
  }

  function isBigBoardTerminal(b: BigBoard): boolean {
    // Check rows, columns, and diagonals for a win in the big board
    for (let i = 0; i < 3; i++) {
      if (
        winnerOfSmallBoard(b[i][0]) &&
        winnerOfSmallBoard(b[i][0]) === winnerOfSmallBoard(b[i][1]) &&
        winnerOfSmallBoard(b[i][0]) === winnerOfSmallBoard(b[i][2])
      )
        return true
      if (
        winnerOfSmallBoard(b[0][i]) &&
        winnerOfSmallBoard(b[0][i]) === winnerOfSmallBoard(b[1][i]) &&
        winnerOfSmallBoard(b[0][i]) === winnerOfSmallBoard(b[2][i])
      )
        return true
    }
    if (
      winnerOfSmallBoard(b[0][0]) &&
      winnerOfSmallBoard(b[0][0]) === winnerOfSmallBoard(b[1][1]) &&
      winnerOfSmallBoard(b[0][0]) === winnerOfSmallBoard(b[2][2])
    )
      return true
    if (
      winnerOfSmallBoard(b[0][2]) &&
      winnerOfSmallBoard(b[0][2]) === winnerOfSmallBoard(b[1][1]) &&
      winnerOfSmallBoard(b[0][2]) === winnerOfSmallBoard(b[2][0])
    )
      return true

    // Check for a draw
    if (b.flat().every((smallBoard) => isSmallBoardTerminal(smallBoard))) return true

    // If none of the above conditions are met, the game is still ongoing
    return false
  }

  function getNextSmallBoard(x: number, y: number): { nextX: number; nextY: number } {
    return { nextX: x % 3, nextY: y % 3 }
  }

  function evaluateBoard(bigBoard: BigBoard): number {
    function winnerOfBigBoard(): string | null {
      for (let i = 0; i < 3; i++) {
        if (
          winnerOfSmallBoard(bigBoard[i][0]) &&
          winnerOfSmallBoard(bigBoard[i][0]) === winnerOfSmallBoard(bigBoard[i][1]) &&
          winnerOfSmallBoard(bigBoard[i][0]) === winnerOfSmallBoard(bigBoard[i][2])
        )
          return winnerOfSmallBoard(bigBoard[i][0])
      }
      if (
        winnerOfSmallBoard(bigBoard[0][0]) &&
        winnerOfSmallBoard(bigBoard[0][0]) === winnerOfSmallBoard(bigBoard[1][1]) &&
        winnerOfSmallBoard(bigBoard[0][0]) === winnerOfSmallBoard(bigBoard[2][2])
      )
        return winnerOfSmallBoard(bigBoard[0][0])

      return null
    }

    let winner = winnerOfBigBoard()
    if (winner === 'X') return -10
    if (winner === 'O') return 10

    return 0
  }

  function minimax(
    board: BigBoard,
    bigX: number,
    bigY: number,
    depth: number,
    isMaximizing: boolean,
    maxDepth = 5
  ): number {
    // console.log(depth)

    if (isBigBoardTerminal(board) || depth == maxDepth) return evaluateBoard(board)

    if (isMaximizing) {
      let bestScore = -Infinity
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (board[bigX][bigY][i][j] === '') {
            board[bigX][bigY][i][j] = 'O'
            let { nextX, nextY } = getNextSmallBoard(i, j)
            let score = minimax(board, nextX, nextY, depth + 1, false)
            board[bigX][bigY][i][j] = ''
            bestScore = Math.max(score, bestScore)
          }
        }
      }
      return bestScore
    } else {
      let bestScore = Infinity
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (board[bigX][bigY][i][j] === '') {
            board[bigX][bigY][i][j] = 'X'
            let { nextX, nextY } = getNextSmallBoard(i, j)
            let score = minimax(board, nextX, nextY, depth + 1, true)
            board[bigX][bigY][i][j] = ''
            bestScore = Math.min(score, bestScore)
          }
        }
      }
      return bestScore
    }
  }

  function bestMove(bigX: number, bigY: number): { smallX: number; smallY: number } {
    let bestScore = -Infinity
    let bestMove = { smallX: -1, smallY: -1 }

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[bigX][bigY][i][j] === '') {
          board[bigX][bigY][i][j] = 'O'
          let { nextX, nextY } = getNextSmallBoard(i, j)
          console.time('minimax')
          let score = minimax(board, nextX, nextY, 0, false)
          console.timeEnd('minimax')
          board[bigX][bigY][i][j] = ''
          if (score > bestScore) {
            bestScore = score
            bestMove = { smallX: i, smallY: j }
          }
        }
      }
    }
    return bestMove
  }

  function onClick(bigX: number, bigY: number, smallX: number, smallY: number) {
    board[bigX][bigY][smallX][smallY] = 'X'
    let { nextX, nextY } = getNextSmallBoard(smallX, smallY)
    bigX = nextX
    bigY = nextY

    if (isBigBoardTerminal(board)) return

    // Player O (computer) move
    let best = bestMove(bigX, bigY)
    board[bigX][bigY][best.smallX][best.smallY] = 'O'
    let next = getNextSmallBoard(best.smallX, best.smallY)
    bigX = next.nextX
    bigY = next.nextY
  }
</script>

<div class="w-48 h-48 border">
  <div class="grid grid-cols-3 gap-2 border">
    {#each board as bigRow, bigX}
      {#each bigRow as smBoard, bigY}
        <div class="grid grid-cols-3">
          {#each smBoard as row, smallX}
            {#each row as cell, smallY}
              <button
                on:click={() => onClick(bigX, bigY, smallX, smallY)}
                class="btn variant-ghost"
              >
                {cell || '-'}
              </button>
            {/each}
          {/each}
        </div>
      {/each}
    {/each}
  </div>
</div>
