<script lang="ts">
  import { goto } from '$app/navigation'
  import MenuTop from '$lib/components/MenuTop.svelte'
  import MetaBoard from '$lib/components/MetaBoard.svelte'
  import { getAuth } from '$lib/useAuth'
  import { setMetaboard } from '$lib/useMetaBoard'

  const { user } = getAuth()
  $: if (!$user) goto('/')

  setMetaboard()
</script>

<MenuTop />

<div class="max-w-xl mx-auto">
  <MetaBoard />
</div>
