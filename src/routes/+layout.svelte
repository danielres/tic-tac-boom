<script lang="ts">
  import { getAuth, setAuth } from '$lib/useAuth'
  import { arrow, autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom'
  import { ProgressRadial, storePopup } from '@skeletonlabs/skeleton'
  import '../app.postcss'

  storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow })

  setAuth()
  const { getRedirectResult } = getAuth()
</script>

{#await getRedirectResult()}
  <div class="flex fixed inset-0 items-center justify-center border">
    <ProgressRadial width="w-16" stroke={80} />
  </div>
{:then _}
  <slot />
{/await}
