<script lang="ts">
  export let variant = 'variant-soft-surface'
</script>

<div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
  <!-- Backdrop -->
  <div class="fixed inset-0 bg-surface-900 backdrop-blur bg-opacity-90 transition-opacity" />

  <!-- Modal -->
  <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
    <div class="flex min-h-full items-end justify-center sm:items-center sm:p-0">
      <div class="alert {variant} rounded p-8 shadow">
        <div class="text-center space-y-4">
          <slot />
        </div>
      </div>
    </div>
  </div>
</div>
