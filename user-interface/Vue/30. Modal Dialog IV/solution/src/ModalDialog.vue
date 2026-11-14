<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    required: true,
  },
});
const emit = defineEmits(['close']);

const modalId = Math.random().toString(36).slice(2);
const titleId = 'modal-title-' + modalId;
const contentId = 'modal-content-' + modalId;
const dialogElement = ref(null);
let triggerElement = null;

function close() {
  emit('close');
}

function getTabbableElements() {
  return Array.from(
    dialogElement.value?.querySelectorAll(
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
  if (!props.open) return;
  if (event.key === 'Escape') {
    close();
    return;
  }
  if (event.key !== 'Tab') return;
  const elements = getTabbableElements();
  if (elements.length === 0) {
    event.preventDefault();
    dialogElement.value.focus();
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

onMounted(() => document.addEventListener('keydown', handleKeydown));
onBeforeUnmount(() => document.removeEventListener('keydown', handleKeydown));

watch(
  () => props.open,
  async (open, wasOpen) => {
    if (open && !wasOpen) {
      triggerElement = document.activeElement;
      await nextTick();
      (getTabbableElements()[0] ?? dialogElement.value).focus();
    } else if (!open && wasOpen && triggerElement instanceof HTMLElement) {
      await nextTick();
      triggerElement.focus();
    }
  },
);
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="modal-overlay"
      @mousedown.self="close"
      @touchstart.self="close">
      <div
        ref="dialogElement"
        class="modal"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="titleId"
        :aria-describedby="contentId"
        tabindex="-1">
        <h1 class="modal-title" :id="titleId">
          {{ title }}
        </h1>
        <div :id="contentId"><slot /></div>
        <button type="button" @click="close">Close</button>
      </div>
    </div>
  </Teleport>
</template>
