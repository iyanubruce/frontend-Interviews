<script setup>
import { ref } from 'vue';
import ModalDialog from './ModalDialog.vue';

const open = ref(false);
</script>

<template>
  <button type="button" @click="open = true">Show modal</button>
  <ModalDialog :open="open" title="Modal Title" @close="open = false">
    <p>
      One morning, when Gregor Samsa woke from troubled dreams, he found himself
      transformed in his bed into a horrible vermin. He lay on his armour-like
      back, and if he lifted his head a little he could see his brown belly,
      slightly domed and divided by arches into stiff sections.
    </p>
  </ModalDialog>
</template>
