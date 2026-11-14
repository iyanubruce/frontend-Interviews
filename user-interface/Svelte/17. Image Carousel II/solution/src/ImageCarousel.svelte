<script>
  import { onMount } from 'svelte';

  export let images;

  let carouselElement;
  let currentIndex = 0;
  let imageWidth = 0;
  let isTransitioning = false;

  function updateImageWidth() {
    imageWidth = carouselElement.getBoundingClientRect().width;
    isTransitioning = false;
  }

  function changeIndex(index) {
    const nextIndex = (index + images.length) % images.length;
    if (isTransitioning || nextIndex === currentIndex) {
      return;
    }
    currentIndex = nextIndex;
    isTransitioning = true;
  }

  onMount(() => {
    updateImageWidth();
    window.addEventListener('resize', updateImageWidth);

    return () => window.removeEventListener('resize', updateImageWidth);
  });
</script>

<div class="image-carousel" bind:this={carouselElement}>
  <div
    class:image-carousel__row--transitioning={isTransitioning}
    class="image-carousel__row"
    style:transform={'translateX(-' + currentIndex * imageWidth + 'px)'}
    on:transitionend={() => (isTransitioning = false)}
  >
    {#each images as image (image.src)}
      <img
        class="image-carousel__image"
        src={image.src}
        alt={image.alt}
      />
    {/each}
  </div>
  <button
    aria-label="Previous image"
    class="image-carousel__button image-carousel__button--prev"
    disabled={isTransitioning}
    on:click={() => changeIndex(currentIndex - 1)}
  >
    &#10094;
  </button>
  <div class="image-carousel__pages">
    {#each images as image, index (image.src)}
      <button
        aria-label={'Navigate to ' + image.alt}
        class:image-carousel__pages__button--active={index === currentIndex}
        class="image-carousel__pages__button"
        disabled={isTransitioning}
        on:click={() => changeIndex(index)}
      ></button>
    {/each}
  </div>
  <button
    aria-label="Next image"
    class="image-carousel__button image-carousel__button--next"
    disabled={isTransitioning}
    on:click={() => changeIndex(currentIndex + 1)}
  >
    &#10095;
  </button>
</div>

