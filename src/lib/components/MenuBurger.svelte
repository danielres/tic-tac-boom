<script lang="ts">
  import { dev } from '$app/environment'
  import Icon from '$lib/components/Icon.svelte'
  import { getContextMetaboard } from '$lib/useMetaBoard'
  import { popup } from '@skeletonlabs/skeleton'

  const { undo, moves, movesUndone, reset, loadGame, redo } = getContextMetaboard()

  let _class = ''
  export { _class as class }
</script>

<button class={_class} use:popup={{ event: 'click', target: 'popupActions', placement: 'bottom' }}>
  <Icon name="bars-3" size="w-full" />
</button>

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
