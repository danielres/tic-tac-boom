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
  const bestMove = AIFindBestMove(aiDepth, moves, firstPlayer, counter)
  const response = { data: bestMove, counter: get(counter) }
  return response
}

