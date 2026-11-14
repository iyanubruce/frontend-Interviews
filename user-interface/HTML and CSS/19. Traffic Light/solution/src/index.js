import './styles.css';

(() => {
  const config = {
    red: {
      backgroundColor: 'red',
      duration: 4000,
      next: 'green',
    },
    yellow: {
      backgroundColor: 'yellow',
      duration: 500,
      next: 'red',
    },
    green: {
      backgroundColor: 'green',
      duration: 3000,
      next: 'yellow',
    },
  };

  function light({ backgroundColor }) {
    const $lightEl = document.createElement('div');
    $lightEl.classList.add('traffic-light');
    $lightEl.setAttribute('aria-hidden', true);

    if (backgroundColor != null) {
      $lightEl.style.backgroundColor = backgroundColor;
    }
    return $lightEl;
  }

  function trafficLight($rootEl, { initialColor, config, layout }) {
    let currentColor = initialColor;
    const $containerEl = document.createElement('div');
    $containerEl.classList.add('traffic-light-container');
    $containerEl.setAttribute('aria-live', 'polite');
    if (layout === 'vertical') {
      $containerEl.classList.add('traffic-light-container--vertical');
    }

    let timer = null;

    function setTransition() {
      const { duration, next } = config[currentColor];
      timer = setTimeout(() => {
        currentColor = next;
        renderLoop();
      }, duration);
    }

    function render() {
      $containerEl.innerHTML = '';
      $containerEl.setAttribute('aria-label', `Current light: ${currentColor}`);
      Object.keys(config).map((color) => {
        $containerEl.append(
          light({
            backgroundColor:
              color === currentColor
                ? config[color].backgroundColor
                : undefined,
          }),
        );
      });
    }

    function renderLoop() {
      render();
      setTransition();
    }

    $rootEl.append($containerEl);
    renderLoop();

    return () => {
      window.clearTimeout(timer);
      timer = null;
      $containerEl.remove();
    };
  }

  const destroyHorizontalTrafficLight = trafficLight(
    document.getElementById('traffic-light'),
    {
      initialColor: 'red',
      config,
      layout: 'horizontal',
    },
  );

  const destroyVerticalTrafficLight = trafficLight(
    document.getElementById('traffic-light-2'),
    {
      initialColor: 'red',
      config,
      layout: 'vertical',
    },
  );

  // A caller can use the returned function when removing either component.
  // This demo also cleans up both components when the document unloads.
  window.addEventListener('beforeunload', () => {
    destroyHorizontalTrafficLight();
    destroyVerticalTrafficLight();
  });
})();
