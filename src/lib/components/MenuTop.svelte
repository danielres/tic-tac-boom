<script lang="ts">
  import { page } from '$app/stores'
  import MenuBurger from '$lib/components/MenuBurger.svelte'
  import { getMetaboard } from '$lib/useMetaBoard'
  import { getAuth } from '$lib/useAuth'
  import { Avatar, popup } from '@skeletonlabs/skeleton'
  import Icon from './Icon.svelte'

  const metaboard = getMetaboard()
  const { signOut, user } = getAuth()
</script>

<div class="flex p-4 gap-4">
  {#if $page.url.pathname !== '/'}
    <a class="btn-icon variant-soft rounded-full w-12 p-2" href="/" title="Go back">
      <Icon name="arrow-left" size="w-full" />
    </a>
  {/if}

  <div class="ml-auto flex gap-4">
    {#if metaboard}
      <MenuBurger class="btn-icon variant-soft rounded-full w-12 p-2" />
    {/if}

    {#if $user?.photoURL}
      <button
        class="btn-icon"
        use:popup={{ event: 'click', target: 'popupFeatured', placement: 'bottom' }}
      >
        <Avatar src={$user.photoURL} width="w-12" rounded="rounded-full" />
      </button>

      <div class="card p-4 w-72 shadow-xl" data-popup="popupFeatured">
        <div class="grid gap-4">
          <h1>{$user.displayName}</h1>
          <button class="btn variant-ghost-surface" on:click={() => signOut()}>Logout</button>
          <div class="arrow bg-surface-100-800-token" />
        </div>
      </div>
    {/if}
  </div>
</div>
