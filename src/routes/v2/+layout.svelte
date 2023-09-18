<script lang="ts">
  import { arrow, autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom'
  import { Avatar, ProgressRadial, popup, storePopup } from '@skeletonlabs/skeleton'
  import { getRedirectResult, signInWithRedirect, type User } from 'firebase/auth'
  import { writable } from 'svelte/store'
  import { auth, provider } from '../../lib/v2/firebase'

  const userStore = writable<User | null>(null)
  storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow })
  auth.onAuthStateChanged((user) => userStore.set(user))
</script>

{#await getRedirectResult(auth)}
  <div class="flex fixed inset-0 items-center justify-center border">
    <ProgressRadial width="w-16" stroke={80} />
  </div>
{:then _}
  {#if $userStore}
    <div class="card p-4 w-72 shadow-xl" data-popup="popupFeatured">
      <div class="grid gap-4">
        <h1>{$userStore.displayName}</h1>
        <button class="btn variant-ghost-surface" on:click={() => auth.signOut()}>Logout</button>
        <div class="arrow bg-surface-100-800-token" />
      </div>
    </div>
  {/if}

  <div class="flex px-4">
    {#if $userStore?.photoURL}
      <button
        class="ml-auto"
        use:popup={{ event: 'click', target: 'popupFeatured', placement: 'bottom' }}
      >
        <Avatar src={$userStore.photoURL} width="w-12" rounded="rounded-full" />
      </button>
    {/if}
  </div>

  {#if $userStore}
    <slot />
  {:else}
    <div class="flex fixed inset-0">
      <button
        class="btn variant-ghost-surface place-self-center mx-auto"
        on:click={() => signInWithRedirect(auth, provider)}
      >
        Continue with Google
      </button>
    </div>
  {/if}
{:catch error}
  <!-- promise was rejected -->
{/await}
