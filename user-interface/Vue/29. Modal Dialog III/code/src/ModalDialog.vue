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
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    ) ?? [],
  );
}

function handleKeydown(event) {
  if (!props.open) return;
}
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="modal-overlay">
      <div
        ref="dialogElement"
        class="modal"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="titleId"
        :aria-describedby="contentId">
        <h1 class="modal-title" :id="titleId">
          {{ title }}
        </h1>
        <div :id="contentId"><slot /></div>
        <button type="button" @click="close">Close</button>
      </div>
    </div>
  </Teleport>
</template>
