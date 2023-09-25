import type { Writable } from 'svelte/store'

export type Player = 'A' | 'B'
export type SmallBoard = (undefined | Player)[]
export type CellCoordinates = [number, number]
export type BigBoard = SmallBoard[]

//prettier-ignore
export const WINS = [ [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6], ]

export function getCurrentPlayer(moves: CellCoordinates[], firstPlayer: Player): Player {
  return moves.length % 2 === 0 ? firstPlayer : firstPlayer === 'A' ? 'B' : 'A'
}

export function isTerminal(board: SmallBoard) {
  return getboardWinner(board) || isBoardFull(board)
}

export function getboardWinner(board: SmallBoard): Player | undefined {
  for (const WIN of WINS) {
    if (board[WIN[0]] && board[WIN[0]] === board[WIN[1]] && board[WIN[1]] === board[WIN[2]])
      return board[WIN[0]]
  }
  return undefined
}

export function getBigBoardWinner(bigBoard: BigBoard): Player | undefined {
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

function isBoardFull(board: SmallBoard): boolean {
  return board.every((cell) => cell)
}

export function moves2BigBoard(moves: CellCoordinates[], firstPlayer: Player): BigBoard {
  let bigBoard: BigBoard = Array(9)
    .fill(undefined)
    .map(() => Array(9).fill(undefined))
  moves.forEach(
    ([i, j], idx) =>
      (bigBoard[i][j] = idx % 2 === 0 ? firstPlayer : firstPlayer === 'A' ? 'B' : 'A')
  )
  return bigBoard
}

export function AIFindBestMove(
  aiDepth: number,
  moves: CellCoordinates[],
  firstPlayer: Player,
  counter: Writable<number>
) {
  const bigBoard = moves2BigBoard(moves, firstPlayer)
  const lastMove = moves.length ? moves[moves.length - 1] : null
  const allowedCells = computeAllowedCells(bigBoard, lastMove)
  const currentPlayer = getCurrentPlayer(moves, firstPlayer)

  let bestMove: CellCoordinates | null = null
  let bestScore = -Infinity

  for (let move of allowedCells) {
    let tempBoard = structuredClone(bigBoard)
    tempBoard[move[0]][move[1]] = currentPlayer
    let currentScore = minimax(
      tempBoard,
      aiDepth,
      false,
      move,
      currentPlayer === 'A' ? 'B' : 'A',
      counter
    )
    if (currentScore > bestScore) {
      bestScore = currentScore
      bestMove = move
    }
  }

  return bestMove
}

export function minimax(
  board: BigBoard,
  depth: number,
  isMaximizing: boolean,
  lastMove: CellCoordinates | null,
  player: Player,
  counter: Writable<number>
): number {
  const currentPlayer = player === 'A' ? 'B' : 'A'
  counter.update((c) => c + 1)

  const allowedCells = computeAllowedCells(board, lastMove)
  // console.log(player, currentPlayer)

  const score = evaluateBoard(board, currentPlayer)

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

function evaluateBoard(bigBoard: BigBoard, currentPlayer: Player): number {
  const winner = getBigBoardWinner(bigBoard)
  if (winner === currentPlayer) return 10
  if (winner) return -10

  let score = 0

  // Iterate over all small boards
  for (let i = 0; i < 9; i++) {
    let smallWinner = getboardWinner(bigBoard[i])
    if (smallWinner === currentPlayer) score += 3 // AI wins a small board
    else if (smallWinner) score -= 3 // Opponent wins a small board
    else if (isTerminal(bigBoard[i])) score -= 1 // Penalty for terminal small board without a winner
  }

  return score
}

export function computeAllowedCells(
  board: BigBoard,
  lastMove: CellCoordinates | null
): CellCoordinates[] {
  if (getBigBoardWinner(board)) return []

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
