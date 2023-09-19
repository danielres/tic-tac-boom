<script lang="ts">
  let _class = ''
  export { _class as class }
</script>

<div class={_class}>
  <slot />
</div>

<style>
  div {
    display: grid;
    grid-template-columns: 1fr;
  }

  div :global(> *) {
    grid-row-start: 1;
    grid-column-start: 1;
  }
</style>
