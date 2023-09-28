import { get, writable } from 'svelte/store'
import { AIFindBestMove, type CellCoordinates, type Player } from './utils'

// Webworker --------------------------------------------------------------------------------------
export type WorkerEventData = { aiDepth: number; moves: CellCoordinates[]; firstPlayer: Player }
export type WorkerResponseData = ReturnType<typeof computeResponse>

onmessage = (event) => {
  const eventData = JSON.parse(event.data) as WorkerEventData
  const response = computeResponse(eventData)
  postMessage(JSON.stringify(response))
}

function computeResponse(eventData: WorkerEventData) {
  const { aiDepth, moves, firstPlayer } = eventData
  const counter = writable(0)

  const startTime = Date.now()
  const timeLimit = 7500 // Adjust time limit
  let depth = 1
  let bestMove

  // This function will act as a break condition
  const isTimeUp = () => Date.now() - startTime >= timeLimit

  while (!isTimeUp()) {
    const move = AIFindBestMove(depth, moves, firstPlayer, counter)
    if (move) bestMove = move // Update bestMove if a move is found
    depth++ // Increase depth for the next iteration
  }

  const response = { data: bestMove, counter: get(counter) }
  return response
}
