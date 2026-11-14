<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';

const props = defineProps({
  images: {
    type: Array,
    required: true,
  },
});

const carouselElement = ref(null);
const currentIndex = ref(0);
const imageWidth = ref(0);
const isTransitioning = ref(false);

function updateImageWidth() {
  imageWidth.value = carouselElement.value.getBoundingClientRect().width;
  isTransitioning.value = false;
}

function changeIndex(index) {
  const nextIndex = (index + props.images.length) % props.images.length;
  if (isTransitioning.value || nextIndex === currentIndex.value) {
    return;
  }
  currentIndex.value = nextIndex;
  isTransitioning.value = true;
}

onMounted(() => {
  updateImageWidth();
  window.addEventListener('resize', updateImageWidth);
});
onBeforeUnmount(() => {
  window.removeEventListener('resize', updateImageWidth);
});
</script>

<template>
  <div ref="carouselElement" class="image-carousel">
    <div
      :class="[
        'image-carousel__row',
        {
          'image-carousel__row--transitioning': isTransitioning,
        },
      ]"
      :style="{
        transform: 'translateX(-' + currentIndex * imageWidth + 'px)',
      }"
      @transitionend="isTransitioning = false">
      <img
        v-for="image in images"
        :key="image.src"
        class="image-carousel__image"
        :src="image.src"
        :alt="image.alt" />
    </div>
    <button
      aria-label="Previous image"
      class="image-carousel__button image-carousel__button--prev"
      :disabled="isTransitioning"
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
        :disabled="isTransitioning"
        @click="changeIndex(index)"></button>
    </div>
    <button
      aria-label="Next image"
      class="image-carousel__button image-carousel__button--next"
      :disabled="isTransitioning"
      @click="changeIndex(currentIndex + 1)">
      &#10095;
    </button>
  </div>
</template>
