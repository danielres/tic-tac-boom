<script>
  import '../app.postcss'
</script>

<ul>
  {#each Array(2) as _, i}
    <li>
      <a href="/v{i + 1}">v{i + 1}</a>
    </li>
  {/each}
</ul>

<slot />

<style lang="postcss">
  ul {
    @apply flex gap-2 mb-4 bg-black p-2;
  }

  a {
    @apply btn-sm variant-ghost-primary;
  }
</style>
