<script lang="ts">
  import { page } from '$app/stores'
  import Icon from '$lib/components/Icon.svelte'
  import MenuBurger from '$lib/components/Shell/MenuBurger.svelte'
  import { getAuth } from '$lib/useAuth'
  import { getMetaboard } from '$lib/useMetaBoard'
  import { Avatar, popup } from '@skeletonlabs/skeleton'
  import Rules from './Rules.svelte'

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
    <button
      class="btn-icon variant-soft rounded-full w-12 p-3"
      title="Rules"
      use:popup={{ event: 'click', target: 'popupRules', placement: 'bottom' }}
    >
      <div class="text-surface-400">
        <Icon name="question-mark" size="w-full" strokeWidth={3} />
      </div>
    </button>

    <div class="card p-4 w-72 shadow-xl" data-popup="popupRules">
      <Rules />
      <div class="arrow bg-surface-100-800-token" />
    </div>

    {#if metaboard}
      <MenuBurger class="btn-icon variant-soft rounded-full w-12 p-2" />
    {/if}

    {#if $user?.photoURL}
      <button
        class="btn-icon w-12"
        use:popup={{ event: 'click', target: 'popupAuth', placement: 'bottom' }}
      >
        <Avatar src={$user.photoURL} rounded="rounded-full" />
      </button>

      <div class="card p-4 w-72 shadow-xl" data-popup="popupAuth">
        <div class="grid gap-4">
          <h1>{$user.displayName}</h1>
          <button class="btn variant-ghost-surface" on:click={() => signOut()}>Logout</button>
          <div class="arrow bg-surface-100-800-token" />
        </div>
      </div>
    {/if}
  </div>
</div>
