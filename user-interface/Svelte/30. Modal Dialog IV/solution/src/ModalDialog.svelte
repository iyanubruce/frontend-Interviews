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
        'button, [href], input, select, textarea, [tabindex]',
      ) ?? [],
    ).filter((element) => {
      const { visibility } = window.getComputedStyle(element);
      return (
        !element.matches(':disabled') &&
        element.getAttribute('aria-disabled') !== 'true' &&
        element.closest('[aria-hidden="true"]') == null &&
        element.tabIndex >= 0 &&
        visibility !== 'hidden' &&
        visibility !== 'collapse' &&
        element.getClientRects().length > 0
      );
    });
  }

  function handleKeydown(event) {
    if (!open) return;
    if (event.key === 'Escape') {
      close();
      return;
    }
    if (event.key !== 'Tab') return;
    const elements = getTabbableElements();
    if (elements.length === 0) {
      event.preventDefault();
      dialogElement.focus();
      return;
    }

    const firstElement = elements[0];
    const lastElement = elements[elements.length - 1];
    if (elements.length === 1) {
      event.preventDefault();
      firstElement.focus();
      return;
    }
    if (
      (event.shiftKey && document.activeElement === firstElement) ||
      (!event.shiftKey && document.activeElement === lastElement)
    ) {
      event.preventDefault();
      (event.shiftKey ? lastElement : firstElement)?.focus();
    }
  }

  afterUpdate(() => {
    if (open && !wasOpen) {
      triggerElement = document.activeElement;
      (getTabbableElements()[0] ?? dialogElement).focus();
    } else if (!open && wasOpen && triggerElement instanceof HTMLElement) {
      triggerElement.focus();
    }
    wasOpen = open;
  });
</script>

<svelte:window on:keydown={handleKeydown} />

{#if open}
  <div
    class="modal-overlay"
    use:portal
    on:mousedown|self={close}
    on:touchstart|self={close}
  >
    <div
      bind:this={dialogElement}
      class="modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={contentId}
      tabindex="-1"
    >
      <h1 class="modal-title" id={titleId}>{title}</h1>
      <div id={contentId}><slot /></div>
      <button type="button" on:click={close}>Close</button>
    </div>
  </div>
{/if}
