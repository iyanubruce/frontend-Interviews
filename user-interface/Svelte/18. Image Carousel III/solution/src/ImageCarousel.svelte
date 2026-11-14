<script>
  export let images;

  let currentIndex = 0;
  let nextIndex = null;
  let isTransitioning = false;

  $: nextImage = nextIndex === null ? null : images[nextIndex];
  $: visibleIndices =
    nextIndex === null ? [currentIndex] : [currentIndex, nextIndex];
  $: movesLeft =
    nextIndex !== null &&
    (currentIndex === images.length - 1 && nextIndex === 0
      ? true
      : currentIndex === 0 && nextIndex === images.length - 1
        ? false
        : currentIndex < nextIndex);
  $: currentClass =
    "image-carousel__image" +
    (isTransitioning
      ? movesLeft
        ? " image-carousel__image--displaced-left"
        : " image-carousel__image--displaced-right"
      : "");
  $: nextClass =
    "image-carousel__image" +
    (!isTransitioning && nextImage
      ? movesLeft
        ? " image-carousel__image--displaced-right"
        : " image-carousel__image--displaced-left"
      : "");

  function changeIndex(index) {
    const normalizedIndex = (index + images.length) % images.length;
    if (nextIndex !== null || normalizedIndex === currentIndex) {
      return;
    }
    nextIndex = normalizedIndex;
    requestAnimationFrame(() => {
      isTransitioning = true;
    });
  }

  function finishTransition(event, index) {
    if (index !== nextIndex || event.propertyName !== "transform") {
      return;
    }
    currentIndex = nextIndex;
    nextIndex = null;
    isTransitioning = false;
  }
</script>

<div class="image-carousel">
  {#each visibleIndices as index (index)}
    <img
      class={index === currentIndex ? currentClass : nextClass}
      src={images[index].src}
      alt={images[index].alt}
      on:transitionend={(event) => finishTransition(event, index)}
    />
  {/each}
  <button
    aria-label="Previous image"
    class="image-carousel__button image-carousel__button--prev"
    disabled={nextIndex !== null}
    on:click={() => changeIndex(currentIndex - 1)}
  >
    &#10094;
  </button>
  <div class="image-carousel__pages">
    {#each images as image, index (image.src)}
      <button
        aria-label={"Navigate to " + image.alt}
        class:image-carousel__pages__button--active={index === currentIndex}
        class="image-carousel__pages__button"
        disabled={nextIndex !== null}
        on:click={() => changeIndex(index)}
      ></button>
    {/each}
  </div>
  <button
    aria-label="Next image"
    class="image-carousel__button image-carousel__button--next"
    disabled={nextIndex !== null}
    on:click={() => changeIndex(currentIndex + 1)}
  >
    &#10095;
  </button>
</div>
