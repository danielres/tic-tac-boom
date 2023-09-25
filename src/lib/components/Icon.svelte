<script lang="ts">
  // Credits: Heroicons
  // https://heroicons.com/

  export let name = ''
  export let size = 'w-6 h-6'
  export let strokeWidth = 1.5
</script>

{#if name === 'github'}
  <svg viewBox="0 0 24 24" aria-hidden="true" class={size}>
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M12 2C6.477 2 2 6.463 2 11.97c0 4.404 2.865 8.14 6.839 9.458.5.092.682-.216.682-.48 0-.236-.008-.864-.013-1.695-2.782.602-3.369-1.337-3.369-1.337-.454-1.151-1.11-1.458-1.11-1.458-.908-.618.069-.606.069-.606 1.003.07 1.531 1.027 1.531 1.027.892 1.524 2.341 1.084 2.91.828.092-.643.35-1.083.636-1.332-2.22-.251-4.555-1.107-4.555-4.927 0-1.088.39-1.979 1.029-2.675-.103-.252-.446-1.266.098-2.638 0 0 .84-.268 2.75 1.022A9.607 9.607 0 0 1 12 6.82c.85.004 1.705.114 2.504.336 1.909-1.29 2.747-1.022 2.747-1.022.546 1.372.202 2.386.1 2.638.64.696 1.028 1.587 1.028 2.675 0 3.83-2.339 4.673-4.566 4.92.359.307.678.915.678 1.846 0 1.332-.012 2.407-.012 2.734 0 .267.18.577.688.48 3.97-1.32 6.833-5.054 6.833-9.458C22 6.463 17.522 2 12 2Z"
    />
  </svg>
{:else}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke-width={strokeWidth}
    stroke="currentColor"
    class={size}
  >
    {#if name === 'arrow-left'}
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
      />
    {/if}

    {#if name === 'bars-3'}
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
      />
    {/if}

    {#if name === 'question-mark'}
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="m 8.3387885,4.8093877 c 1.8794625,-1.6451319 4.9289755,-1.6451319 6.8084385,0 1.881068,1.645132 1.881068,4.3126533 0,5.9577853 -0.325816,0.287296 -0.690153,0.523232 -1.075354,0.709413 -1.19573,0.579407 -2.32726,1.603402 -2.32726,2.932347 v 1.203756 m -0.0016,4.81502 h 0.01284 v 0.01284 h -0.01284 z"
      />
    {/if}

    {#if name === 'arrow-top-right-on-square'}
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
      />
    {/if}
  </svg>
{/if}
