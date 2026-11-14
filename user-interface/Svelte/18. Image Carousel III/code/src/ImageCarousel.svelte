<script>
  export let images;

  let currentIndex = 0;

  $: currentImage = images[currentIndex];

  function changeIndex(index) {
    currentIndex = (index + images.length) % images.length;
  }
</script>

<div class="image-carousel">
  <img
    class="image-carousel__image"
    src={currentImage.src}
    alt={currentImage.alt}
  />
  <button
    aria-label="Previous image"
    class="image-carousel__button image-carousel__button--prev"
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
        on:click={() => changeIndex(index)}
      ></button>
    {/each}
  </div>
  <button
    aria-label="Next image"
    class="image-carousel__button image-carousel__button--next"
    on:click={() => changeIndex(currentIndex + 1)}
  >
    &#10095;
  </button>
</div>

