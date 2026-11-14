<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
  images: {
    type: Array,
    required: true,
  },
});

const currentIndex = ref(0);
const currentImage = computed(() => props.images[currentIndex.value]);

function changeIndex(index) {
  currentIndex.value = (index + props.images.length) % props.images.length;
}
</script>

<template>
  <div class="image-carousel">
    <img
      class="image-carousel__image"
      :src="currentImage.src"
      :alt="currentImage.alt" />
    <button
      aria-label="Previous image"
      class="image-carousel__button image-carousel__button--prev"
      @click="changeIndex(currentIndex - 1)">
      &#10094;
    </button>
    <div class="image-carousel__pages">
      <button
        v-for="(image, index) in images"
        :key="image.src"
        :aria-label="'Navigate to ' + image.alt"
        :class="[
          'image-carousel__pages__button',
          {
            'image-carousel__pages__button--active': index === currentIndex,
          },
        ]"
        @click="changeIndex(index)"></button>
    </div>
    <button
      aria-label="Next image"
      class="image-carousel__button image-carousel__button--next"
      @click="changeIndex(currentIndex + 1)">
      &#10095;
    </button>
  </div>
</template>
