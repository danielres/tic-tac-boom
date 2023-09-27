<script lang="ts">
  export let mark: 'x' | 'o' | undefined
  let _class = ''
  export { _class as class }
</script>

{#if mark === 'x'}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke-width="2"
    stroke="currentColor"
    class={_class}
  >
    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
{/if}

{#if mark === 'o'}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke-width="2.5"
    stroke="currentColor"
    class="{_class} m-[10%]"
  >
    <path
      d="M 21 12 C 21 18.928 13.5 23.258 7.5 19.794 C 4.715 18.187 3 15.215 3 12 C 3 5.072 10.5 0.742 16.5 4.206 C 19.285 5.813 21 8.785 21 12 Z"
    />
  </svg>
{/if}

<style lang="postcss">
  svg {
    filter: drop-shadow(0px 5px 5px rgb(0 0 0 / 0.2));
  }
</style>
