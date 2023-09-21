<script lang="ts">
  // Credits: Heroicons
  // https://heroicons.com/

  export let name = ''
  export let size = 'w-6 h-6'
  export let strokeWidth = 1.5
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  fill="none"
  viewBox="0 0 24 24"
  stroke-width={strokeWidth}
  stroke="currentColor"
  class={size}
>
  {#if name === 'arrow-left'}
    <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
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
</svg>
