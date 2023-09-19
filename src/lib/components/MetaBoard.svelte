<script lang="ts">
  import { dev } from '$app/environment'
  import { popup } from '@skeletonlabs/skeleton'
  import Icon from './Icon.svelte'
  import Lines from './Lines.svelte'
  import Player from './Player.svelte'
  import Stack from './Stack.svelte'
  import Modal from './Modal.svelte'

  import { useMetaBoard } from '$lib/useMetaBoard'

  const {
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
  } = useMetaBoard()
</script>

{#if $globalWin}
  <Modal variant="variant-soft-success">
    <h3 class="h3">Congratulations!</h3>
    <p class="flex gap-2 justify-center items-center">
      <Player class="w-8" />
      <span>won the round</span>
    </p>
    <button type="button" class="btn variant-soft-success" on:click={() => reset(false)}>
      New Round
    </button>
  </Modal>
{:else if $legalCells.length === 0}
  <Modal variant="variant-soft-surface">
    <h3 class="h3">It's a draw!</h3>
    <button type="button" class="btn variant-soft-surface" on:click={() => reset(false)}>
      New Round
    </button>
  </Modal>
{/if}

<button class="" use:popup={{ event: 'click', target: 'popupActions', placement: 'bottom' }}>
  <Icon name="bars-3" size="w-8" />
</button>

<Stack>
  <Lines class="opacity-20" />

  <div class="metaboard">
    {#each $metaboard as board, boardIdx}
      {@const dimmed = $globalWin || ($currentBoard !== undefined && $currentBoard !== boardIdx)}

      <Stack class="p-4">
        <Stack class={$localWins[boardIdx] ? 'opacity-20' : ''}>
          <Lines class={dimmed ? 'opacity-40' : ''} />

          <div class="board relative">
            {#each board as cell, cellIdx}
              {#if cell}
                <div class="cell">
                  <Player player={cell} />
                </div>
              {:else if dimmed || $globalWin}
                <div class="cell" />
              {:else}
                <button
                  class="cell opacity-0 hover:opacity-60"
                  on:click={() => onClick(boardIdx, cellIdx)}
                >
                  <Player player={$turn} />
                </button>
              {/if}
            {/each}
          </div>
        </Stack>

        {#if $localWins[boardIdx]}
          <div class="localWin">
            <Player player={$localWins[boardIdx]} />
          </div>
        {/if}
      </Stack>
    {/each}
  </div>
</Stack>

<div class="card p-4 w-72 shadow-xl" data-popup="popupActions">
  <div class="grid gap-2">
    <button class="btn variant-ghost" on:click={undo} disabled={!$moves.length}>Undo</button>
    <button class="btn variant-ghost" on:click={redo} disabled={!$movesUndone.length}>Redo</button>
    <button class="btn variant-ghost" on:click={() => reset()} disabled={!$moves.length}>
      Reset
    </button>
    {#if dev}
      <hr class="my-2" />
      <button class="btn variant-ghost-error" on:click={() => loadGame()}>Load game</button>
      <button class="btn variant-ghost-error" on:click={() => loadGame('win')}>Load win</button>
      <button class="btn variant-ghost-error" on:click={() => loadGame('draw')}>Load draw</button>
    {/if}
  </div>
  <div class="arrow bg-surface-100-800-token" />
</div>

{#if dev}
  {JSON.stringify($moves)}
{/if}

<style lang="postcss">
  .metaboard {
    @apply grid grid-cols-3 gap-4;
  }
  .board {
    @apply relative; /* fix for rotate-90 bringing to front */
    @apply grid grid-cols-3;
  }
  .cell {
    @apply aspect-square grid place-items-center;
  }
  .localWin {
    @apply relative; /* fix for rotate-90 bringing to front */
    @apply grid place-items-center text-8xl;
  }
</style>
