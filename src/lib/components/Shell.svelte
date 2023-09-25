<script lang="ts">
  import MenuTop from '$lib/components/Shell/MenuTop.svelte'
  import Ratio from './Ratio.svelte'
</script>

<div class="h-[100svh] grid grid-rows-[auto_1fr_auto] gap-4">
  <Ratio ratiow={1} ratioh={1}>
    <slot />
  </Ratio>

  <div class="px-4 pt-4 row-start-1">
    <MenuTop />
  </div>

  <footer class="text-center text-surface-600 p-4 bg-black/25">FOOTER</footer>
</div>
