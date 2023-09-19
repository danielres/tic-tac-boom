<script lang="ts">
  import { auth, provider } from '$lib/firebase'
  import { Avatar, ProgressRadial, popup } from '@skeletonlabs/skeleton'
  import { getRedirectResult, signInWithRedirect, type User } from 'firebase/auth'
  import { writable } from 'svelte/store'

  const userStore = writable<User | null>(null)
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

  <div class="flex p-4">
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
    <div class="flex py-12">
      <div class="place-self-center mx-auto text-center grid gap-4">
        <h2 class="text-xl">Play!</h2>
        <button
          class="btn variant-ghost-surface"
          on:click={() => signInWithRedirect(auth, provider)}
        >
          Continue with Google
        </button>

        <div class="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
          <hr />
          <div>or</div>
          <hr />
        </div>

        <a href="/practice" class="btn variant-soft-surface">Just practice</a>
      </div>
    </div>
  {/if}
{:catch error}
  <!-- promise was rejected -->
{/await}
