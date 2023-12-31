import {
  WINS,
  type BigBoard,
  type CellCoordinates,
  type Player,
  type SmallBoard,
} from '$lib/utils/board'
import { derived, get, writable, type Writable } from 'svelte/store'

export function useUTTT(startMoves: CellCoordinates[] = [], firstMovePlayer: Player = 'A') {
  const moves = writable<CellCoordinates[]>(startMoves)
  const firstPlayer = writable<Player>(firstMovePlayer)
  const currentPlayer = derived([moves, firstPlayer], ([$m, $fp]) => getCurrentPlayer($m, $fp))
  const bigBoard = derived([moves, firstPlayer], ([$m, $fp]) => moves2BigBoard($m, $fp))
  const allowedBoards = derived([moves, firstPlayer], ([$m, $fp]) => moves2AllowedBoards($m, $fp))
  const bigBoardWinner = derived(bigBoard, getBigBoardWinner)
  const allowedCells = derived([bigBoard, moves], ([$bigBoard, $moves]) => {
    const lastMove = $moves.length ? $moves[$moves.length - 1] : null
    return computeAllowedCells($bigBoard, lastMove)
  })

  function moves2AllowedBoards(moves: CellCoordinates[], firstPlayer: Player): number[] {
    const allBoards = [0, 1, 2, 3, 4, 5, 6, 7, 8]
    if (!moves.length) return allBoards
    const lastMove = moves[moves.length - 1]
    const bigBoard = moves2BigBoard(moves, firstPlayer)
    if (getBigBoardWinner(bigBoard)) return []
    if (isTerminal(bigBoard[lastMove[1]])) return allBoards.filter((i) => !isTerminal(bigBoard[i]))
    return [lastMove[1]]
  }

  function isCellAllowed(allowedCells: CellCoordinates[], [i, j]: CellCoordinates) {
    return allowedCells.find((cell) => cell && cell[0] === i && cell[1] === j)
  }

  function playMove(coordinates: CellCoordinates) {
    if (!isCellAllowed(get(allowedCells), coordinates)) return
    moves.update(($moves) => [...$moves, coordinates])
  }

  function switchFirstPlayer() {
    if (get(moves).length) return
    firstPlayer.update(($fp) => ($fp === 'A' ? 'B' : 'A'))
  }

  function resetGame() {
    moves.set([])
  }

  return {
    moves2AllowedBoards,
    isCellAllowed,
    playMove,
    switchFirstPlayer,
    resetGame,
    moves,
    firstPlayer,
    currentPlayer,
    bigBoard,
    allowedBoards,
    bigBoardWinner,
    allowedCells,
  }
}

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
  counter: Writable<number>,
  alpha: number = -Infinity,
  beta: number = Infinity
): number {
  counter.update((c) => c + 1)

  const allowedCells = computeAllowedCells(board, lastMove)
  const score = evaluateBoard(board, player === 'A' ? 'B' : 'A')

  if (depth === 0 || Math.abs(score) === 10) return score

  let bestScore = isMaximizing ? -Infinity : Infinity

  const evaluateMove = (move: CellCoordinates, tempBoard: BigBoard) => {
    tempBoard[move[0]][move[1]] = player
    if (getboardWinner(tempBoard[move[1]]) && isTerminal(tempBoard[move[1]])) return bestScore
    return minimax(
      tempBoard,
      depth - 1,
      !isMaximizing,
      move,
      player === 'A' ? 'B' : 'A',
      counter,
      alpha,
      beta
    )
  }

  for (const move of allowedCells) {
    let tempBoard = structuredClone(board)
    const newScore = evaluateMove(move, tempBoard)

    // For Maximizing Player
    if (isMaximizing) {
      bestScore = Math.max(bestScore, newScore)
      alpha = Math.max(alpha, bestScore)
    } else {
      // For Minimizing Player
      bestScore = Math.min(bestScore, newScore)
      beta = Math.min(beta, bestScore)
    }

    // Alpha Beta Pruning
    if (beta <= alpha) {
      break
    }
  }

  return bestScore
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
