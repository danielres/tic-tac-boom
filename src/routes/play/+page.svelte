<script lang="ts">
  import { goto } from '$app/navigation'
  import MetaBoard from '$lib/components/MetaBoard.svelte'
  import Shell from '$lib/components/Shell.svelte'
  import { getAuth } from '$lib/useAuth'
  import { setMetaboard } from '$lib/useMetaBoard'

  const { user } = getAuth()
  $: if (!$user) goto('/')

  setMetaboard()
</script>

<Shell>
  <MetaBoard />
</Shell>
