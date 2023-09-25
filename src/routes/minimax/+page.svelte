<script lang="ts">
  import { tick } from 'svelte'
  import { derived, writable, type Writable } from 'svelte/store'

  //prettier-ignore
  const WINS = [ [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6], ]

  type Player = 'A' | 'B'
  type SmallBoard = (undefined | Player)[]
  type CellCoordinates = [number, number]
  type BigBoard = SmallBoard[]

  const moves = writable<CellCoordinates[]>([])
  const firstPlayer = writable<Player>('A')
  const currentPlayer = derived([moves, firstPlayer], ([$moves, $firstPlayer]) =>
    $moves.length % 2 === 0 ? $firstPlayer : $firstPlayer === 'A' ? 'B' : 'A'
  )
  const bigBoard = derived([moves, firstPlayer], ([$m, $fp]) => moves2BigBoard($m, $fp))
  const allowedBoards = derived(moves, moves2AllowedBoards)
  const bigBoardWinner = derived(bigBoard, getBigBoardWinner)
  const allowedCells = derived([bigBoard, moves], ([$bigBoard, $moves]) =>
    computeAllowedCells($bigBoard, $moves.length ? $moves[$moves.length - 1] : null)
  )

  function getBigBoardWinner(bigBoard: BigBoard): Player | undefined {
    for (const WIN of WINS) {
      if (
        getboardWinner(bigBoard[WIN[0]]) &&
        getboardWinner(bigBoard[WIN[0]]) === getboardWinner(bigBoard[WIN[1]]) &&
        getboardWinner(bigBoard[WIN[1]]) === getboardWinner(bigBoard[WIN[2]])
      )
        return getboardWinner(bigBoard[WIN[0]])
    }
    return undefined
  }

  function moves2BigBoard(moves: CellCoordinates[], firstPlayer: Player): BigBoard {
    let bigBoard: BigBoard = Array(9)
      .fill(undefined)
      .map(() => Array(9).fill(undefined))
    moves.forEach(
      ([i, j], idx) =>
        (bigBoard[i][j] = idx % 2 === 0 ? firstPlayer : firstPlayer === 'A' ? 'B' : 'A')
    )
    return bigBoard
  }

  function isTerminal(board: SmallBoard) {
    return getboardWinner(board) || isBoardFull(board)
  }

  function moves2AllowedBoards(moves: CellCoordinates[]): number[] {
    const allBoards = [0, 1, 2, 3, 4, 5, 6, 7, 8]
    if (!moves.length) return allBoards
    const lastMove = moves[moves.length - 1]
    const bigBoard = moves2BigBoard(moves, $firstPlayer)
    if (isTerminal(bigBoard[lastMove[1]])) return allBoards.filter((i) => !isTerminal(bigBoard[i]))
    return [lastMove[1]]
  }

  function getboardWinner(board: SmallBoard): Player | undefined {
    for (const WIN of WINS) {
      if (board[WIN[0]] && board[WIN[0]] === board[WIN[1]] && board[WIN[1]] === board[WIN[2]])
        return board[WIN[0]]
    }
    return undefined
  }

  function isBoardFull(board: SmallBoard): boolean {
    return board.every((cell) => cell)
  }

  function isCellAllowed(allowedCells: CellCoordinates[], [i, j]: CellCoordinates) {
    return allowedCells.find((cell) => cell && cell[0] === i && cell[1] === j)
  }

  function playMove(coordinates: CellCoordinates) {
    if (!isCellAllowed($allowedCells, coordinates)) return
    $moves = [...$moves, coordinates]
  }

  function evaluateBoard(bigBoard: BigBoard): number {
    const winner = getBigBoardWinner(bigBoard)
    if (winner === $currentPlayer) return 10
    if (winner) return -10

    let score = 0

    // Iterate over all small boards
    for (let i = 0; i < 9; i++) {
      let smallWinner = getboardWinner(bigBoard[i])
      if (smallWinner === $currentPlayer) score += 3 // AI wins a small board
      else if (smallWinner) score -= 3 // Opponent wins a small board
      else if (isTerminal(bigBoard[i])) score -= 1 // Penalty for terminal small board without a winner
    }

    return score
  }

  function computeAllowedCells(
    board: BigBoard,
    lastMove: CellCoordinates | null
  ): CellCoordinates[] {
    const allowedBoards = lastMove
      ? isTerminal(board[lastMove[1]])
        ? board.map((_, idx) => idx).filter((i) => !isTerminal(board[i]))
        : [lastMove[1]]
      : [0, 1, 2, 3, 4, 5, 6, 7, 8]
    return board
      .map((smallBoard, i) => {
        if (!allowedBoards.includes(i)) return undefined
        return smallBoard
          .map((cell, j) => (cell ? undefined : <CellCoordinates>[i, j]))
          .filter(Boolean)
      })
      .filter(Boolean)
      .flat()
  }

  function minimax(
    board: BigBoard,
    depth: number,
    isMaximizing: boolean,
    lastMove: CellCoordinates | null,
    player: Player,
    counter: Writable<number>
  ): number {
    $counter++

    const allowedCells = computeAllowedCells(board, lastMove)
    const score = evaluateBoard(board)

    if (depth === 0 || Math.abs(score) === 10) return score

    if (isMaximizing) {
      let bestScore = -Infinity
      for (let move of allowedCells) {
        let tempBoard = structuredClone(board)
        tempBoard[move[0]][move[1]] = player
        if (!getboardWinner(tempBoard[move[1]]) && isTerminal(tempBoard[move[1]])) continue
        let newScore = minimax(
          tempBoard,
          depth - 1,
          !isMaximizing,
          move,
          player === 'A' ? 'B' : 'A',
          counter
        )
        bestScore = Math.max(bestScore, newScore)
      }
      return bestScore
    } else {
      let bestScore = Infinity
      for (let move of allowedCells) {
        let tempBoard = structuredClone(board)
        tempBoard[move[0]][move[1]] = player
        if (!getboardWinner(tempBoard[move[1]]) && isTerminal(tempBoard[move[1]])) continue
        let newScore = minimax(
          tempBoard,
          depth - 1,
          !isMaximizing,
          move,
          player === 'A' ? 'B' : 'A',
          counter
        )
        bestScore = Math.min(bestScore, newScore)
      }
      return bestScore
    }
  }
  let counter = writable(0)

  function AIPlayBestMove() {
    const allowedCells = computeAllowedCells(
      $bigBoard,
      $moves.length ? $moves[$moves.length - 1] : null
    )
    let bestMove: CellCoordinates | null = null
    let bestScore = -Infinity

    for (let move of allowedCells) {
      let tempBoard = structuredClone($bigBoard)
      tempBoard[move[0]][move[1]] = $currentPlayer
      let currentScore = minimax(
        tempBoard,
        4,
        false,
        move,
        $currentPlayer === 'A' ? 'B' : 'A',
        counter
      )
      if (currentScore > bestScore) {
        bestScore = currentScore
        bestMove = move
      }
    }

    if (bestMove) playMove(bestMove)
  }
</script>

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
            on:click={async () => {
              playMove([i, j])
              await tick()
              console.time('AIPlayBestMove')
              AIPlayBestMove()
              console.timeEnd('AIPlayBestMove')
            }}
          >
            {cell || '-'}
          </button>
        {/each}
      </div>
    {/if}
  {/each}
</div>

<!-- 
<pre>Moves: {JSON.stringify(moves)}</pre>
<pre>BigBoard: {JSON.stringify($bigBoard)}</pre>
<pre>$currentPlayer: {$currentPlayer}</pre>
<pre>allowedCells: {JSON.stringify(allowedCells)}</pre>
<pre>$bigBoardWinner: {JSON.stringify($bigBoardWinner)}</pre>
<pre>counter: {JSON.stringify($counter)}</pre> -->
