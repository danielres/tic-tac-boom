<script lang="ts">
  import Stack from './Stack.svelte'
  let _class = ''
  export { _class as class }
</script>

<Stack class="{_class} pointer-events-none">
  <div class="flex justify-between rotate-0">
    <div />
    <div class="line" />
    <div class="line" />
    <div />
  </div>

  <div class="flex justify-between rotate-90">
    <div />
    <div class="line" />
    <div class="line" />
    <div />
  </div>
</Stack>

<style lang="postcss">
  .line {
    @apply w-1 h-full rounded-full bg-surface-300;
  }
</style>
