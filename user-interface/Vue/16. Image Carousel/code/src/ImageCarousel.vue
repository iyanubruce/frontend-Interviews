<script setup>
defineProps({
  images: {
    type: Array,
    required: true,
  },
});
</script>

<template>
  <div>
    <img
      v-for="image in images"
      :key="image.src"
      :src="image.src"
      :alt="image.alt"
      width="100%" />
  </div>
</template>
