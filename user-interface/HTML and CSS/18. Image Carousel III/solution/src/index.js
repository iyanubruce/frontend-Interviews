import './styles.css';

const images = [
  { src: 'https://picsum.photos/id/600/600/400', alt: 'Forest' },
  { src: 'https://picsum.photos/id/100/600/400', alt: 'Beach' },
  { src: 'https://picsum.photos/id/200/600/400', alt: 'Yak' },
  { src: 'https://picsum.photos/id/300/600/400', alt: 'Hay' },
  { src: 'https://picsum.photos/id/400/600/400', alt: 'Plants' },
  { src: 'https://picsum.photos/id/500/600/400', alt: 'Building' },
];

function shouldMoveLeft(currentIndex, nextIndex, totalImages) {
  if (currentIndex === totalImages - 1 && nextIndex === 0) {
    return true;
  }
  if (currentIndex === 0 && nextIndex === totalImages - 1) {
    return false;
  }
  return currentIndex < nextIndex;
}

function imageCarousel(root, options) {
  let currentIndex = 0;
  let nextIndex = null;
  let currentImageElement = null;

  root.innerHTML =
    '<div class="wrapper"><div class="image-carousel">' +
    '<div class="image-carousel__images"></div>' +
    '<button aria-label="Previous image" class="image-carousel__button image-carousel__button--prev">&#10094;</button>' +
    '<div class="image-carousel__pages"></div>' +
    '<button aria-label="Next image" class="image-carousel__button image-carousel__button--next">&#10095;</button>' +
    '</div></div>';

  const imagesElement = root.querySelector('.image-carousel__images');
  const pagesElement = root.querySelector('.image-carousel__pages');
  const navigationButtons = Array.from(
    root.querySelectorAll('.image-carousel__button'),
  );

  function createImage(image) {
    const element = document.createElement('img');
    element.className = 'image-carousel__image';
    element.src = image.src;
    element.alt = image.alt;
    return element;
  }

  const pageButtons = options.images.map((image, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'image-carousel__pages__button';
    button.setAttribute('aria-label', 'Navigate to ' + image.alt);
    button.addEventListener('click', () => changeIndex(index));
    pagesElement.append(button);
    return button;
  });

  function updateControls() {
    const disabled = nextIndex !== null;
    navigationButtons.forEach((button) => {
      button.disabled = disabled;
    });
    pageButtons.forEach((button, index) => {
      button.disabled = disabled;
      button.classList.toggle(
        'image-carousel__pages__button--active',
        index === currentIndex,
      );
    });
  }

  function changeIndex(index) {
    const normalizedIndex =
      (index + options.images.length) % options.images.length;
    if (nextIndex !== null || normalizedIndex === currentIndex) {
      return;
    }

    nextIndex = normalizedIndex;
    const moveLeft = shouldMoveLeft(
      currentIndex,
      nextIndex,
      options.images.length,
    );
    const exitClass = moveLeft
      ? 'image-carousel__image--displaced-left'
      : 'image-carousel__image--displaced-right';
    const enterClass = moveLeft
      ? 'image-carousel__image--displaced-right'
      : 'image-carousel__image--displaced-left';
    const nextImageElement = createImage(options.images[nextIndex]);
    nextImageElement.classList.add(enterClass);
    imagesElement.append(nextImageElement);
    updateControls();

    requestAnimationFrame(() => {
      currentImageElement.classList.add(exitClass);
      nextImageElement.classList.remove(enterClass);
    });

    nextImageElement.addEventListener(
      'transitionend',
      () => {
        currentImageElement.remove();
        currentImageElement = nextImageElement;
        currentIndex = nextIndex;
        nextIndex = null;
        updateControls();
      },
      { once: true },
    );
  }

  currentImageElement = createImage(options.images[currentIndex]);
  imagesElement.append(currentImageElement);
  root
    .querySelector('.image-carousel__button--prev')
    .addEventListener('click', () => changeIndex(currentIndex - 1));
  root
    .querySelector('.image-carousel__button--next')
    .addEventListener('click', () => changeIndex(currentIndex + 1));
  updateControls();
}

imageCarousel(document.querySelector('#app'), { images });
