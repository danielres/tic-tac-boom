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
    @apply flex gap-4;
  }

  a {
    @apply btn variant-ghost-primary;
  }
</style>
