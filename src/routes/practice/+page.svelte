<script lang="ts">
  import MetaBoard from '$lib/components/MetaBoard.svelte'
  import Shell from '$lib/components/Shell.svelte'
  import { setMetaboard } from '$lib/useMetaBoard'

  setMetaboard()
</script>

<Shell>
  <MetaBoard />
</Shell>
