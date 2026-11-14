<script setup>
import { computed, nextTick, ref } from 'vue';

const props = defineProps({
  images: {
    type: Array,
    required: true,
  },
});

const currentIndex = ref(0);
const nextIndex = ref(null);
const isTransitioning = ref(false);
const currentImage = computed(() => props.images[currentIndex.value]);
const nextImage = computed(() =>
  nextIndex.value === null ? null : props.images[nextIndex.value],
);
const movesLeft = computed(() => {
  if (currentIndex.value === props.images.length - 1 && nextIndex.value === 0) {
    return true;
  }
  if (currentIndex.value === 0 && nextIndex.value === props.images.length - 1) {
    return false;
  }
  return currentIndex.value < nextIndex.value;
});

async function changeIndex(index) {
  const normalizedIndex = (index + props.images.length) % props.images.length;
  if (nextIndex.value !== null || normalizedIndex === currentIndex.value) {
    return;
  }

  nextIndex.value = normalizedIndex;
  await nextTick();
  requestAnimationFrame(() => {
    isTransitioning.value = true;
  });
}

function finishTransition() {
  currentIndex.value = nextIndex.value;
  nextIndex.value = null;
  isTransitioning.value = false;
}
</script>

<template>
  <div class="image-carousel">
    <img
      :class="[
        'image-carousel__image',
        {
          'image-carousel__image--displaced-left': isTransitioning && movesLeft,
          'image-carousel__image--displaced-right':
            isTransitioning && !movesLeft,
        },
      ]"
      :src="currentImage.src"
      :alt="currentImage.alt" />
    <img
      v-if="nextImage"
      :class="[
        'image-carousel__image',
        {
          'image-carousel__image--displaced-right':
            !isTransitioning && movesLeft,
          'image-carousel__image--displaced-left':
            !isTransitioning && !movesLeft,
        },
      ]"
      :src="nextImage.src"
      :alt="nextImage.alt"
      @transitionend="finishTransition" />
    <button
      aria-label="Previous image"
      class="image-carousel__button image-carousel__button--prev"
      :disabled="nextIndex !== null"
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
        :disabled="nextIndex !== null"
        @click="changeIndex(index)"></button>
    </div>
    <button
      aria-label="Next image"
      class="image-carousel__button image-carousel__button--next"
      :disabled="nextIndex !== null"
      @click="changeIndex(currentIndex + 1)">
      &#10095;
    </button>
  </div>
</template>
