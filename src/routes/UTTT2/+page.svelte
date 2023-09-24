<script lang="ts">
  //prettier-ignore
  const WINS = [ [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6], ]

  type Player = 'A' | 'B'
  type SmallBoard = (undefined | Player)[]
  type CellCoordinates = [number, number]
  type BigBoard = SmallBoard[]

  let moves: CellCoordinates[] = []
  let firstPlayer: Player = 'A'
  $: currentPlayer = moves.length % 2 === 0 ? firstPlayer : firstPlayer === 'A' ? 'B' : 'A'
  $: bigBoard = moves2BigBoard(moves)
  $: allowedBoards = moves2AllowedBoards(moves)
  $: bigBoardWinner = getBigBoardWinner(bigBoard)
  $: allowedCells = getBigBoardWinner(bigBoard)
    ? []
    : bigBoard
        .map((smallBoard, i) => {
          if (!allowedBoards.includes(i)) return undefined
          return smallBoard.map((cell, j) => (cell ? undefined : [i, j])).filter(Boolean)
        })
        .filter(Boolean)
        .flat()

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

  function moves2BigBoard(moves: CellCoordinates[]): BigBoard {
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

  function isCellAllowed([i, j]: CellCoordinates) {
    return allowedCells.find((cell) => cell && cell[0] === i && cell[1] === j)
  }

  function playMove(coordinates: CellCoordinates) {
    if (!isCellAllowed(coordinates)) return
    moves = [...moves, coordinates]
  }
</script>

<pre>Moves: {JSON.stringify(moves)}</pre>
<pre>BigBoard: {JSON.stringify(bigBoard)}</pre>
<pre>currentPlayer: {currentPlayer}</pre>
<pre>allowedCells: {JSON.stringify(allowedCells)}</pre>
<pre>bigBoardWinner: {JSON.stringify(bigBoardWinner)}</pre>

<div class="w-1/3 mx-auto">
  <div class="grid grid-cols-3 gap-8">
    {#each bigBoard as smallBoard, i}
      {#if getboardWinner(smallBoard)}
        <div class:variant-ghost={allowedBoards.includes(i)}>{getboardWinner(smallBoard)}</div>
      {:else}
        <div class="grid grid-cols-3" class:variant-ghost={allowedBoards.includes(i)}>
          {#each smallBoard as cell, j}
            <button
              disabled={!allowedCells.find((ac) => ac?.length && ac[0] === i && ac[1] === j)}
              class="aspect-square"
              on:click={() => playMove([i, j])}
            >
              {cell || '-'}
            </button>
          {/each}
        </div>
      {/if}
    {/each}
  </div>
</div>
