import { get, writable } from 'svelte/store'
import { AIFindBestMove, type CellCoordinates, type Player } from './utils'
import AIFindBestMoveWorker from './AIFindBestMove.worker?worker'

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

// Function to call the webworker from the main thread ---------------------------------------------
const aiFindBestMoveWorker = new AIFindBestMoveWorker()

export async function workerAIFindBestMove(
  aiDepth: number,
  moves: CellCoordinates[],
  firstPlayer: Player
) {
  const promise = new Promise((resolve, reject) => {
    aiFindBestMoveWorker.onmessage = (event) => resolve(event.data)
    aiFindBestMoveWorker.onerror = (error) => reject(error)
    aiFindBestMoveWorker.postMessage(JSON.stringify({ aiDepth, moves, firstPlayer }))
  })
  const resp = (await promise) as any

  return JSON.parse(resp) as WorkerResponseData
}
