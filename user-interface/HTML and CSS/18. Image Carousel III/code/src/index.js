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

  root.innerHTML =
    '<div class="wrapper"><div class="image-carousel">' +
    '<img class="image-carousel__image" />' +
    '<button aria-label="Previous image" class="image-carousel__button image-carousel__button--prev">&#10094;</button>' +
    '<div class="image-carousel__pages"></div>' +
    '<button aria-label="Next image" class="image-carousel__button image-carousel__button--next">&#10095;</button>' +
    '</div></div>';

  const imageElement = root.querySelector('.image-carousel__image');
  const pagesElement = root.querySelector('.image-carousel__pages');

  const pageButtons = options.images.map((image, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'image-carousel__pages__button';
    button.setAttribute('aria-label', 'Navigate to ' + image.alt);
    button.addEventListener('click', () => {
      currentIndex = index;
      render();
    });
    pagesElement.append(button);
    return button;
  });

  function render() {
    const image = options.images[currentIndex];
    imageElement.src = image.src;
    imageElement.alt = image.alt;
    pageButtons.forEach((button, index) => {
      button.classList.toggle(
        'image-carousel__pages__button--active',
        index === currentIndex,
      );
    });
  }

  root
    .querySelector('.image-carousel__button--prev')
    .addEventListener('click', () => {
      currentIndex =
        (currentIndex - 1 + options.images.length) % options.images.length;
      render();
    });

  root
    .querySelector('.image-carousel__button--next')
    .addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % options.images.length;
      render();
    });

  render();
}

imageCarousel(document.querySelector('#app'), { images });
