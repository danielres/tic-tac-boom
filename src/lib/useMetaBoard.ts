import { derived, writable, type Readable, type Writable, get } from 'svelte/store'
import { getContext, setContext } from 'svelte'

export function setMetaboard() {
  const metaboard = useMetaBoard()
  setContext('metaboard', metaboard)
  return metaboard
}

export function getMetaboard(): ReturnType<typeof useMetaBoard> {
  return getContext('metaboard')
}

type Player = 'x' | 'o'
type Board = (undefined | Player)[]
type Move = [Player, number, number]
type CellCoordinates = [number, number]

//prettier-ignore
const WINS = [ [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6], ]

//prettier-ignore
const WIN: Move[] = [["o",4,4],["x",4,7],["o",7,5],["x",5,3],["o",3,5],["x",5,4],["o",4,8],["x",8,3],["o",3,4],["x",4,0],["o",0,4],["x",4,2],["o",2,5],["x",5,5],["o",3,3],["x",4,1],["o",1,7],["x",7,8],["o",8,8],["x",8,2],["o",2,6],["x",6,4],["o",6,5],["x",7,4],["o",7,0],["x",0,8],["o",8,0],["x",0,6],["o",6,8],["x",8,6],["o",6,2],["x",2,4],["o",7,1],["x",1,4],["o",7,2],["x",2,7],["x",0,1],["o",1,5],["x",0,5],["o",0,7],["x",8,1],["o",1,1],["x",1,8],["o",8,4]]
//prettier-ignore
const DRAW: Move[] = [["o",4,4],["x",4,7],["o",7,5],["x",5,3],["o",3,5],["x",5,4],["o",4,8],["x",8,3],["o",3,4],["x",4,0],["o",0,4],["x",4,2],["o",2,5],["x",5,5],["o",3,3],["x",4,1],["o",1,7],["x",7,8],["o",8,8],["x",8,2],["o",2,6],["x",6,4],["o",6,5],["x",7,4],["o",7,0],["x",0,8],["o",8,0],["x",0,6],["o",6,8],["x",8,6],["o",6,2],["x",2,4],["o",7,1],["x",1,4],["o",7,2],["x",2,7],["x",1,6],["o",1,2],["x",2,2],["o",2,8],["x",8,1],["o",1,3],["x",0,3],["o",0,0],["x",0,2],["o",2,1],["x",1,8],["o",8,7],["x",1,5],["o",2,3],["x",0,1],["o",1,1],["x",1,0],["o",0,5],["x",2,0],["o",0,7],["x",8,4]]
//prettier-ignore
const GAME: Move[] = [["o",4,4],["x",4,7],["o",7,5],["x",5,3],["o",3,5],["x",5,4],["o",4,8],["x",8,3],["o",3,4],["x",4,0],["o",0,4],["x",4,2],["o",2,5],["x",5,5],["o",3,3],["x",4,1],["o",1,7],["x",7,8],["o",8,8],["x",8,2],["o",2,6],["x",6,4],["o",6,5],["x",7,4],["o",7,0],["x",0,8],["o",8,0],["x",0,6],["o",6,8],["x",8,6],["o",6,2],["x",2,4],["o",7,1],["x",1,4],["o",7,2],["x",2,7]]

function useMetaBoard() {
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
  const localDraws = derived(metaboard, ($mb) => $mb.map((board) => getLocalDraw(board)))
  const globalWin = derived(localWins, ($localWins) => getGlobalWin($localWins))
  const currentBoard = derived(
    [lastMove, localWins, localDraws],
    ([$lastMove, $localWins, $localDraws]) => {
      if (!$lastMove) return undefined
      if ($localWins[$lastMove[2]]) return undefined
      if ($localDraws[$lastMove[2]]) return undefined
      return $lastMove[2]
    }
  )

  // const legalCells: Readable<CellCoordinates[]> = derived(
  //   [globalWin, localWins, localDraws, currentBoard],
  //   ([$globalWin, $localWins, $localDraws, $currentBoard]) => {
  //     if ($globalWin) return []
  //     const arr = []
  //     for (let i = 0; i < 9; i++) {
  //       if ($currentBoard !== undefined && $currentBoard !== i) continue
  //       if ($localWins[i]) continue
  //       if ($localDraws[i]) continue
  //       for (let j = 0; j < 9; j++) {
  //         if (get(metaboard)[i][j]) continue
  //         arr.push([i, j] as CellCoordinates)
  //       }
  //     }
  //     return arr
  //   }
  // )

  const legalCells: Readable<CellCoordinates[]> = derived(
    [globalWin, localWins, localDraws, currentBoard],
    ([$globalWin, $localWins, $localDraws, $currentBoard]) => {
      if ($globalWin) return []
      return Array.from({ length: 9 }, (_, board) => {
        if ($currentBoard !== undefined && $currentBoard !== board) return []
        if ($localWins[board] || $localDraws[board]) return []
        return Array.from({ length: 9 }, (_, cell) => {
          if (get(metaboard)[board][cell]) return undefined
          return [board, cell]
        }).filter(Boolean)
      }).flat()
    }
  )

  function onClick(board: number, cell: number) {
    if (get(metaboard)[board][cell]) return // Ensure the clicked cell is empty
    if (get(localWins)[board]) return // Ensure the clicked board is not won
    if (get(localDraws)[board]) return // Ensure the clicked board is not a draw
    if (get(currentBoard) !== undefined && get(currentBoard) !== board) return // If there's a currentBoard, ensure the clicked board is the correct one
    // moves.update(($moves) => [...$moves, [get(turn), board, cell]])
    moves.update(($moves) => [...$moves, ['x', board, cell]])
    const [bestBoard, bestCell] = findBestMove(get(metaboard))
    moves.update(($moves) => [...$moves, ['o', bestBoard, bestCell]])
    movesUndone.set([])
  }

  function reset(confirmation = true) {
    if (confirmation && !confirm('Are you sure you want to reset the board?')) return
    moves.set([])
    movesUndone.set([])
  }

  function undo() {
    if (!get(moves).length) return
    const undone = get(moves)[get(moves).length - 1]
    movesUndone.update(($movesUndone) => [...$movesUndone, undone])
    moves.update(($moves) => $moves.slice(0, -1))
  }

  function redo() {
    if (!get(movesUndone).length) return
    moves.update(($moves) => [...$moves, get(movesUndone)[get(movesUndone).length - 1]])
    movesUndone.update(($movesUndone) => $movesUndone.slice(0, -1))
  }

  function loadGame(kind: 'win' | 'draw' | 'game' = 'game') {
    movesUndone.set([])
    if (kind === 'win') moves.set(WIN)
    if (kind === 'game') moves.set(GAME)
    if (kind === 'draw') moves.set(DRAW)
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

  function getLocalWin(board: Board): Player | undefined {
    for (const win of WINS) {
      if (board[win[0]] && board[win[0]] === board[win[1]] && board[win[1]] === board[win[2]])
        return board[win[0]]
    }
    return undefined
  }

  function getLocalDraw(board: Board): boolean {
    return board.every((cell) => cell !== undefined)
  }

  // function evaluateMetaBoard(metaBoard: Board[]): number {
  //   const globalWin = getGlobalWin(metaBoard.map((board) => getLocalWin(board)))
  //   if (globalWin === 'x') return 10
  //   if (globalWin === 'o') return -10
  //   return 0
  // }

  function evaluateMetaBoard(metaBoard: Board[]): number {
    const globalWin = getGlobalWin(metaBoard.map((board) => getLocalWin(board)))
    if (globalWin === 'x') return -10
    if (globalWin === 'o') return 10

    for (let i = 0; i < 9; i++) {
      const localWin = getLocalWin(metaBoard[i])
      if (localWin === 'x') return -5
      if (localWin === 'o') return 5
    }

    return 0
  }

  function minimax(metaBoard: Board[], depth: number, isMax: boolean, maxDepth: number): number {
    const score = evaluateMetaBoard(metaBoard)
    if (score !== 0 || depth == maxDepth)
      return heuristicEvaluate(metaBoard) + evaluateLocalThreats(metaBoard)
    if (metaBoard.every((board) => getLocalDraw(board))) return 0

    if (isMax) {
      let best = -Infinity
      for (const [boardIndex, cellIndex] of get(legalCells)) {
        metaBoard[boardIndex][cellIndex] = 'o'
        best = Math.max(best, minimax(metaBoard, depth + 1, !isMax, maxDepth))
        metaBoard[boardIndex][cellIndex] = undefined
      }
      return best
    } else {
      let best = Infinity
      for (const [boardIndex, cellIndex] of get(legalCells)) {
        metaBoard[boardIndex][cellIndex] = 'x'
        best = Math.min(best, minimax(metaBoard, depth + 1, !isMax, maxDepth))
        metaBoard[boardIndex][cellIndex] = undefined
      }
      return best
    }
  }

  function findBestMove(metaBoard: Board[]): [number, number] {
    let bestVal = Infinity
    let bestMove: [number, number] = [-1, -1]

    const legalCellsCount = get(legalCells).length

    let maxDepth = 0 // Adjust this value as needed.
    if (legalCellsCount <= 9) maxDepth = 3
    // if (legalCellsCount <= 8) maxDepth = 4
    // if (legalCellsCount <= 5) maxDepth = 5
    // if (legalCellsCount <= 3) maxDepth = 6
    console.log({ legalCellsCount, maxDepth })

    const legalMoves = get(legalCells) // Fetch the array of legal moves.

    for (const [boardIndex, cellIndex] of legalMoves) {
      metaBoard[boardIndex][cellIndex] = 'o' // AI plays as 'o'
      const moveVal = minimax(metaBoard, 0, false, maxDepth) // AI evaluates as Min player
      metaBoard[boardIndex][cellIndex] = undefined

      if (moveVal < bestVal) {
        // AI looks for minimum value
        bestMove = [boardIndex, cellIndex]
        bestVal = moveVal
      }
    }

    return bestMove
  }

  // function heuristicEvaluate(metaBoard: Board[]): number {
  //   const globalWin = getGlobalWin(metaBoard.map((board) => getLocalWin(board)))
  //   if (globalWin === 'o') return 10 // 'o' winning is positive
  //   if (globalWin === 'x') return -10 // 'x' winning is negative

  //   return 0 // Neutral score if no heuristic matches.
  // }

  function heuristicEvaluate(metaBoard: Board[]): number {
    let score = 0

    // Center move gets higher score
    if (!metaBoard[4][4])
      score += 5

      // Corner move gets a score
    ;[0, 2, 6, 8].forEach((i) => {
      if (!metaBoard[i][i]) score += 1
    })
    console.log({ score })

    return score
  }

  function evaluateLocalThreats(metaBoard: Board[]): number {
    let threats = 0
    for (let i = 0; i < 9; i++) {
      const localWin = getLocalWin(metaBoard[i])
      if (localWin === 'x') threats++ // Add more weight if 'x' wins locally
    }
    console.log({ threats })
    return -threats // Negative because these are threats against 'o'
  }

  return {
    currentBoard,
    globalWin,
    legalCells,
    loadGame,
    localWins,
    metaboard,
    moves,
    movesUndone,
    onClick,
    redo,
    reset,
    turn,
    undo,
  }
}
