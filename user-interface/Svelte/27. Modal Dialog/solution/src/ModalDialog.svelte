<script context="module">
  let nextModalId = 0;
</script>

<script>
  import { afterUpdate, createEventDispatcher } from 'svelte';

  export let open = false;
  export let title;

  const dispatch = createEventDispatcher();
  const modalId = ++nextModalId;
  const titleId = 'modal-title-' + modalId;
  const contentId = 'modal-content-' + modalId;

  let dialogElement;
  let triggerElement;
  let wasOpen = false;

  function portal(node) {
    document.body.appendChild(node);
    return {
      destroy() {
        node.remove();
      },
    };
  }

  function close() {
    dispatch('close');
  }

  function getTabbableElements() {
    return Array.from(
      dialogElement?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      ) ?? [],
    );
  }

  function handleKeydown(event) {
    if (!open) return;
    
  }

  afterUpdate(() => {
    
    wasOpen = open;
  });
</script>

<svelte:window on:keydown={handleKeydown} />

{#if open}
  <div
    class="modal-overlay"
    use:portal
    
  >
    <div
      bind:this={dialogElement}
      class="modal"
      
    >
      <h1 class="modal-title" >{title}</h1>
      <div ><slot /></div>
      <button type="button" on:click={close}>Close</button>
    </div>
  </div>
{/if}

