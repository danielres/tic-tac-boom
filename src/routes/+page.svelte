<script lang="ts">
  import Shell from '$lib/components/Shell.svelte'
  import { getAuth } from '$lib/useAuth'
  import { arrow, autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom'
  import { storePopup } from '@skeletonlabs/skeleton'
  import '../app.postcss'

  const { user, signInWithGoogle } = getAuth()
  storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow })
</script>

<Shell>
  <div slot="content" class="text-center grid gap-4 max-w-xs mx-auto pt-24">
    <h3 class="h3 text-surface-400 tracking-wider">
      <div>Tic Tac Boom!</div>
      <div>💥</div>
    </h3>

    {#if $user}
      <a href="/play" class="btn variant-ghost-surface">Play</a>
    {:else}
      <h2 class="text-xl">Play!</h2>

      <button class="btn variant-ghost-surface" on:click={() => signInWithGoogle('/play')}>
        Continue with Google
      </button>
    {/if}

    <div class="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
      <hr />
      <div>or</div>
      <hr />
    </div>

    <a href="/practice" class="btn variant-soft-surface">Just practice</a>
  </div>
</Shell>
