import './styles.css';

const images = [
  { src: 'https://picsum.photos/id/600/600/400', alt: 'Forest' },
  { src: 'https://picsum.photos/id/100/600/400', alt: 'Beach' },
  { src: 'https://picsum.photos/id/200/600/400', alt: 'Yak' },
  { src: 'https://picsum.photos/id/300/600/400', alt: 'Hay' },
  { src: 'https://picsum.photos/id/400/600/400', alt: 'Plants' },
  { src: 'https://picsum.photos/id/500/600/400', alt: 'Building' },
];

function imageCarousel(root, options) {
  let currentIndex = 0;
  let imageWidth = 0;
  let isTransitioning = false;

  root.innerHTML =
    '<div class="wrapper"><div class="image-carousel">' +
    '<div class="image-carousel__row"></div>' +
    '<button aria-label="Previous image" class="image-carousel__button image-carousel__button--prev">&#10094;</button>' +
    '<div class="image-carousel__pages"></div>' +
    '<button aria-label="Next image" class="image-carousel__button image-carousel__button--next">&#10095;</button>' +
    '</div></div>';

  const carouselElement = root.querySelector('.image-carousel');
  const rowElement = root.querySelector('.image-carousel__row');
  const pagesElement = root.querySelector('.image-carousel__pages');
  const navigationButtons = Array.from(
    root.querySelectorAll('.image-carousel__button'),
  );

  options.images.forEach((image) => {
    const imageElement = document.createElement('img');
    imageElement.className = 'image-carousel__image';
    imageElement.src = image.src;
    imageElement.alt = image.alt;
    rowElement.append(imageElement);
  });

  const pageButtons = options.images.map((image, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'image-carousel__pages__button';
    button.setAttribute('aria-label', 'Navigate to ' + image.alt);
    button.addEventListener('click', () => changeIndex(index));
    pagesElement.append(button);
    return button;
  });

  function render() {
    rowElement.style.transform =
      'translateX(-' + currentIndex * imageWidth + 'px)';
    pageButtons.forEach((button, index) => {
      button.classList.toggle(
        'image-carousel__pages__button--active',
        index === currentIndex,
      );
      button.disabled = isTransitioning;
    });
    navigationButtons.forEach((button) => {
      button.disabled = isTransitioning;
    });
  }

  function updateImageWidth() {
    imageWidth = carouselElement.getBoundingClientRect().width;
    rowElement.classList.remove('image-carousel__row--transitioning');
    isTransitioning = false;
    render();
  }

  function changeIndex(index) {
    if (isTransitioning || index === currentIndex) {
      return;
    }
    currentIndex = (index + options.images.length) % options.images.length;
    isTransitioning = true;
    rowElement.classList.add('image-carousel__row--transitioning');
    render();
  }

  rowElement.addEventListener('transitionend', () => {
    isTransitioning = false;
    rowElement.classList.remove('image-carousel__row--transitioning');
    render();
  });
  root
    .querySelector('.image-carousel__button--prev')
    .addEventListener('click', () => changeIndex(currentIndex - 1));
  root
    .querySelector('.image-carousel__button--next')
    .addEventListener('click', () => changeIndex(currentIndex + 1));
  window.addEventListener('resize', updateImageWidth);

  updateImageWidth();
}

imageCarousel(document.querySelector('#app'), { images });
