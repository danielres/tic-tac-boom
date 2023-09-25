<script lang="ts">
  import { tick } from 'svelte'
  import { derived, writable, type Writable } from 'svelte/store'
  import {
    computeAllowedCells,
    getBigBoardWinner,
    getboardWinner,
    isTerminal,
    minimax,
    type BigBoard,
    type CellCoordinates,
    type Player,
    getCurrentPlayer,
    AIFindBestMove,
    moves2BigBoard,
  } from './utils'

  const AI_DEPTH = 4

  const moves = writable<CellCoordinates[]>([])
  const firstPlayer = writable<Player>('A')
  const currentPlayer = derived([moves, firstPlayer], ([$m, $fp]) => getCurrentPlayer($m, $fp))
  const bigBoard = derived([moves, firstPlayer], ([$m, $fp]) => moves2BigBoard($m, $fp))
  const allowedBoards = derived([moves, firstPlayer], ([$m, $fp]) => moves2AllowedBoards($m, $fp))
  const bigBoardWinner = derived(bigBoard, getBigBoardWinner)
  const allowedCells = derived([bigBoard, moves], ([$bigBoard, $moves]) => {
    const lastMove = $moves.length ? $moves[$moves.length - 1] : null
    return computeAllowedCells($bigBoard, lastMove)
  })
  const counter = writable(0)

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
    if (!isCellAllowed($allowedCells, coordinates)) return
    $moves = [...$moves, coordinates]
  }

  const onClick = async ([i, j]: CellCoordinates) => {
    playMove([i, j])
    await tick()
    console.time('AIPlayBestMove')
    const bestMove = AIFindBestMove(AI_DEPTH, $moves, $firstPlayer, counter)
    if (bestMove) playMove(bestMove)
    console.timeEnd('AIPlayBestMove')
  }
</script>

{#if $bigBoardWinner}
  Winner: {$bigBoardWinner}
{/if}

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
            on:click={() => onClick([i, j])}
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
