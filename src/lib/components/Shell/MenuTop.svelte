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

<div class="flex gap-4">
  {#if $page.url.pathname !== '/'}
    <a class="btn-icon variant-soft rounded-full w-12 p-2" href="/" title="Go back">
      <Icon name="arrow-left" size="w-full" />
    </a>
  {/if}

  <div class="ml-auto flex gap-4">
    <button
      class="btn-icon variant-soft rounded-full w-12 p-3"
      title="Rules"
      use:popup={{ event: 'click', target: 'popupHelp', placement: 'bottom' }}
    >
      <div class="text-surface-400">
        <Icon name="question-mark" size="w-full" strokeWidth={3} />
      </div>
    </button>

    <div class="card w-80 shadow-xl" data-popup="popupHelp">
      <div class="px-4 pt-2 pb-4">
        <h2 class="text-surface-400 flex justify-between items-baseline">
          <span>Ultimate Tic Tac Toe</span>
          <a
            href="https://en.wikipedia.org/wiki/Ultimate_tic-tac-toe"
            target="_blank"
            class="btn-icon text-xs opacity-75 underline mr-4"
          >
            <span>Wikipedia</span>
            <span>
              <Icon name="arrow-top-right-on-square" size="h-4 -ml-1" />
            </span>
          </a>
        </h2>

        <Rules />
      </div>

      <div
        class="grid items-center grid-cols-2 text-center text-sm border-t border-surface-600 bg-black/10"
      >
        <span class="opacity-50">by Daniel Reszka</span>
        <span class="border-l border-surface-600">
          <a class="btn-icon" href="https://github.com/danielres/tic-tac-boom">
            <Icon name="github" size="w-8 h-8 fill-surface-500" />
          </a>
        </span>
      </div>

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
