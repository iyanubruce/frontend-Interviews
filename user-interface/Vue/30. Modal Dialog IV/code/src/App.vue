<script setup>
import { ref } from 'vue';
import ModalDialog from './ModalDialog.vue';

const open = ref(false);
</script>

<template>
  <button type="button" @click="open = true">Show modal</button>
  <ModalDialog :open="open" title="Feedback" @close="open = false">
    <div class="contents">
      <div>Provide your feedback, we will get back in 3-5 business days.</div>
      <input placeholder="john@gmail.com" />
      <textarea placeholder="Your message here" rows="5"></textarea>
      <button type="button">Submit</button>
    </div>
  </ModalDialog>
</template>
