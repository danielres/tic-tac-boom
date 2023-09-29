import type { CellCoordinates, Player } from '$lib/utils/board';
import { get, writable } from 'svelte/store';
import { AIFindBestMove } from './useUTTT';

// Webworker --------------------------------------------------------------------------------------
export type WorkerEventData = { moves: CellCoordinates[]; firstPlayer: Player }
export type WorkerResponseData = ReturnType<typeof computeResponse>

const TIME_LIMIT = 3500

onmessage = (event) => {
  const eventData = JSON.parse(event.data) as WorkerEventData
  const response = computeResponse(eventData)
  postMessage(JSON.stringify(response))
}

function computeResponse(eventData: WorkerEventData) {
  const { moves, firstPlayer } = eventData
  const counter = writable(0)

  const startTime = Date.now()
  const timeLimit = TIME_LIMIT
  let depth = 1
  let bestMove

  // This function will act as a break condition
  const isTimeUp = () => Date.now() - startTime >= timeLimit

  while (!isTimeUp()) {
    const move = AIFindBestMove(depth, moves, firstPlayer, counter)
    if (move) bestMove = move // Update bestMove if a move is found
    depth++ // Increase depth for the next iteration
    console.log('depth', depth)
  }

  const response = { data: bestMove, counter: get(counter) }
  return response
}
