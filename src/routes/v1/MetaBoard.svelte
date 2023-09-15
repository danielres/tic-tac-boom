<script lang="ts">
  import { writable } from 'svelte/store'
  import Board from './Board.svelte'

  const turn = writable('X')

  const lastCoord = writable([undefined, undefined, undefined])

  const state = writable([
    [
      [undefined, undefined, undefined],
      [undefined, undefined, undefined],
      [undefined, undefined, undefined],
    ],
    [
      [undefined, undefined, undefined],
      [undefined, undefined, undefined],
      [undefined, undefined, undefined],
    ],
    [
      [undefined, undefined, undefined],
      [undefined, undefined, undefined],
      [undefined, undefined, undefined],
    ],
    [
      [undefined, undefined, undefined],
      [undefined, undefined, undefined],
      [undefined, undefined, undefined],
    ],
    [
      [undefined, undefined, undefined],
      [undefined, undefined, undefined],
      [undefined, undefined, undefined],
    ],
    [
      [undefined, undefined, undefined],
      [undefined, undefined, undefined],
      [undefined, undefined, undefined],
    ],
    [
      [undefined, undefined, undefined],
      [undefined, undefined, undefined],
      [undefined, undefined, undefined],
    ],
    [
      [undefined, undefined, undefined],
      [undefined, undefined, undefined],
      [undefined, undefined, undefined],
    ],
    [
      [undefined, undefined, undefined],
      [undefined, undefined, undefined],
      [undefined, undefined, undefined],
    ],
  ])
</script>

<div class="board">
  <div class="row">
    <div class="cell">
      <Board
        disabled={$lastCoord[1] ? $lastCoord[1] !== 0 || $lastCoord[2] !== 0 : false}
        {lastCoord}
        {state}
        {turn}
        index={0}
      />
    </div>
    <div class="cell border-l-4">
      <Board
        disabled={$lastCoord[1] ? $lastCoord[1] !== 0 || $lastCoord[2] !== 1 : false}
        {lastCoord}
        {state}
        {turn}
        index={1}
      />
    </div>
    <div class="cell border-l-4">
      <Board
        disabled={$lastCoord[1] ? $lastCoord[1] !== 0 || $lastCoord[2] !== 2 : false}
        {lastCoord}
        {state}
        {turn}
        index={2}
      />
    </div>
  </div>
  <div class="row border-t-4">
    <div class="cell">
      <Board
        disabled={$lastCoord[1] ? $lastCoord[1] !== 1 || $lastCoord[2] !== 0 : false}
        {lastCoord}
        {state}
        {turn}
        index={3}
      />
    </div>
    <div class="cell border-l-4">
      <Board
        disabled={$lastCoord[1] ? $lastCoord[1] !== 1 || $lastCoord[2] !== 1 : false}
        {lastCoord}
        {state}
        {turn}
        index={4}
      />
    </div>
    <div class="cell border-l-4">
      <Board
        disabled={$lastCoord[1] ? $lastCoord[1] !== 1 || $lastCoord[2] !== 2 : false}
        {lastCoord}
        {state}
        {turn}
        index={5}
      />
    </div>
  </div>
  <div class="row border-t-4">
    <div class="cell">
      <Board
        disabled={$lastCoord[1] ? $lastCoord[1] !== 2 || $lastCoord[2] !== 0 : false}
        {lastCoord}
        {state}
        {turn}
        index={6}
      />
    </div>
    <div class="cell border-l-4">
      <Board
        disabled={$lastCoord[1] ? $lastCoord[1] !== 2 || $lastCoord[2] !== 1 : false}
        {lastCoord}
        {state}
        {turn}
        index={7}
      />
    </div>
    <div class="cell border-l-4">
      <Board
        disabled={$lastCoord[1] ? $lastCoord[1] !== 2 || $lastCoord[2] !== 2 : false}
        {lastCoord}
        {state}
        {turn}
        index={8}
      />
    </div>
  </div>
</div>
<p>{$turn}</p>
<p>{$lastCoord}</p>
<p>{JSON.stringify($state)}</p>

<style lang="postcss">
  .board {
    @apply grid;
  }

  .row {
    @apply grid  grid-cols-3;
  }

  .cell {
    @apply p-4;
  }
</style>
