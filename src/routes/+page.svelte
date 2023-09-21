<script lang="ts">
  import MenuTop from '$lib/components/MenuTop.svelte'
  import { getAuth } from '$lib/useAuth'
  import { arrow, autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom'
  import { storePopup } from '@skeletonlabs/skeleton'
  import '../app.postcss'

  const { user, signInWithGoogle } = getAuth()
  storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow })
</script>

<MenuTop />

<div class="flex py-12">
  <div class="place-self-center mx-auto text-center grid gap-4">
    {#if $user}
      <a href="/play" class="btn variant-soft-surface">Play</a>
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
</div>
