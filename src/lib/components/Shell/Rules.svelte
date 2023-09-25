<script>
  import Icon from '$lib/components/Icon.svelte'
</script>

<ul class="list-disc ml-4 text-sm space-y-2">
  <li>Win 3 small boards in a row, you win the game.</li>
  <li>
    When you play in a small square, the next player is constrained to the matching large square.
  </li>
  <li>
    If the matching large square is already won or full, the next player is free to choose any
    square.
  </li>
</ul>
