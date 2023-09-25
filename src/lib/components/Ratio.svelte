<!--
  @component
  Allows to create responsive containers with a fixed aspect ratio.
  Uses container queries to determine the size of the container.
  The contained element will be as large as possible while maintaining the aspect ratio.

  @example

  ```tsx
  <div class="outer h-[100svh] grid grid-rows-[auto_1fr_auto]">
    <nav>(Menu)</nav>

    <Ratio ratiow={1} ratioh={1}>
      <main class="border">
        Becomes as large as possible 
        while maintaining the aspect ratio.
      </main>
    </Ratio>

    <footer>(Footer)</footer>
  </div>
  ```
-->

<script>
  export let ratiow = 16
  export let ratioh = 9
</script>

<div class="ratio-container grid items-center" style:--ratiow={ratiow} style:--ratioh={ratioh}>
  <main class="contained">
    <slot />
  </main>
</div>

<style>
  .ratio-container {
    container-type: size;
    width: 100%;
    height: 100%;
  }

  .contained {
    width: min(100cqw, 100cqh * var(--ratiow) / var(--ratioh));
    height: min(100cqw * var(--ratioh) / var(--ratiow), 100cqh);
    display: grid;
    margin-inline: auto;
  }
</style>
