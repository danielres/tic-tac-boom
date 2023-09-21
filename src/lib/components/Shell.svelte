<script lang="ts">
  import MenuTop from '$lib/components/Shell/MenuTop.svelte'
</script>

<slot name="content">
  <div class="h-screen flex items-center">
    <div class="max-w-xl mx-auto flex-grow">
      <slot />
    </div>
  </div>
</slot>

<div class="fixed left-0 top-0 right-0">
  <MenuTop />
</div>
