import './styles.css';

(() => {
  const $celsiusInputEl = document.getElementById('celsius-input');
  const $fahrenheitInputEl = document.getElementById('fahrenheit-input');

  function bindInput($source, $dest, calculateValue) {
    $source.addEventListener('input', (event) => {
      const value = event.target.value;
      if (value.trim() === '') {
        $dest.value = '';
        return;
      }

      const numericValue = Number(value);
      const result = calculateValue(numericValue);
      $dest.value =
        Number.isFinite(numericValue) && Number.isFinite(result)
          ? format(result)
          : '';
    });
  }

  function format(number) {
    return String(Number(number.toFixed(4)));
  }

  bindInput(
    $celsiusInputEl,
    $fahrenheitInputEl,
    (value) => (value * 9) / 5 + 32,
  );

  bindInput(
    $fahrenheitInputEl,
    $celsiusInputEl,
    (value) => ((value - 32) * 5) / 9,
  );
})();
