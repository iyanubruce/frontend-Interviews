import './styles.css';

(() => {
  function starRating($rootElement, { max = 5, value = 0, onChange }) {
    const STAR_BUTTON_CLASS = 'star-button';
    const STAR_ICON_CLASS = 'star-icon';
    const STAR_ICON_FILLED_CLASS = 'star-icon-filled';
    const STAR_TEMPLATE = (index) => `<button
      aria-label="Rate ${index + 1} stars"
      aria-pressed="false"
      class="${STAR_BUTTON_CLASS}"
      type="button">
      <svg
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        class="${STAR_ICON_CLASS}"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    </button>`;

    let currentValue = value;

    function initialize() {
      const html = Array.from({ length: max }, (_, index) =>
        STAR_TEMPLATE(index),
      ).join('');
      // Using .innerHTML is safe here since it's non-user content.
      $rootElement.innerHTML = html;
      $rootElement.classList.add('star-rating');
      $rootElement.setAttribute('aria-label', 'Star rating');
      $rootElement.setAttribute('role', 'group');

      $rootElement.addEventListener('click', (event) => {
        const $starButton = event.target.closest(`.${STAR_BUTTON_CLASS}`);
        if ($starButton == null) {
          return;
        }

        const nextValue = [...$rootElement.children].indexOf($starButton) + 1;
        setValue(nextValue);
      });

      $rootElement.addEventListener('mouseover', (event) => {
        const $starButton = event.target.closest(`.${STAR_BUTTON_CLASS}`);
        if ($starButton == null) {
          return;
        }

        const previewValue =
          [...$rootElement.children].indexOf($starButton) + 1;
        highlightStars(previewValue);
      });

      $rootElement.addEventListener('focusin', (event) => {
        const $starButton = event.target.closest(`.${STAR_BUTTON_CLASS}`);
        if ($starButton == null) return;
        const previewValue =
          [...$rootElement.children].indexOf($starButton) + 1;
        highlightStars(previewValue);
      });

      $rootElement.addEventListener('mouseleave', () => {
        highlightStars(currentValue);
      });

      $rootElement.addEventListener('focusout', () => {
        highlightStars(currentValue);
      });
    }

    function setValue(value, notify = true) {
      currentValue = value;
      highlightStars(currentValue);
      [...$rootElement.children].forEach(($button, index) => {
        $button.setAttribute('aria-pressed', String(index + 1 === value));
      });
      if (notify && onChange != null) onChange(value);
    }

    function highlightStars(index) {
      for (let i = 0; i < $rootElement.children.length; i++) {
        const $icon = $rootElement.children[i].querySelector(
          `.${STAR_ICON_CLASS}`,
        );
        if (i < index) {
          $icon.classList.add(STAR_ICON_FILLED_CLASS);
        } else {
          $icon.classList.remove(STAR_ICON_FILLED_CLASS);
        }
      }
    }

    initialize();
    setValue(currentValue, false);

    return {
      // Expose a setValue function so that users can imperatively
      // change the value of the widget in the case of external
      // events. Not strictly necessary but helpful if the need arises.
      setValue,
    };
  }

  starRating(document.getElementById('star-rating'), {
    max: 5,
    value: 3,
    onChange: (value) => console.log('Primary rating:', value),
  });
  starRating(document.getElementById('star-rating-2'), {
    max: 10,
    value: 5,
    onChange: (value) => console.log('Secondary rating:', value),
  });
})();
