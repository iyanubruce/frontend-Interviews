<script>
  let celsius = '';
  let fahrenheit = '';

  function format(number) {
    return String(Number(number.toFixed(4)));
  }

  function convert(value, calculateValue) {
    if (value.trim() === '') {
      return '';
    }

    const numericValue = Number(value);
    const result = calculateValue(numericValue);
    return Number.isFinite(numericValue) &&
      Number.isFinite(result)
      ? format(result)
      : '';
  }
</script>

<div class="temperature-converter">
  <label>
    <input
      class="temperature-converter-column-top-row"
      inputmode="decimal"
      type="text"
      value={celsius}
      on:input={(event) => {
        celsius = event.target.value;
        fahrenheit = convert(
          celsius,
          (value) => (value * 9) / 5 + 32,
        );
      }} />
    <div class="temperature-converter-column-bottom-row">
      Celsius
    </div>
  </label>
  <div>
    <div class="temperature-converter-column-top-row">
      =
    </div>
  </div>
  <label>
    <input
      class="temperature-converter-column-top-row"
      inputmode="decimal"
      type="text"
      value={fahrenheit}
      on:input={(event) => {
        fahrenheit = event.target.value;
        celsius = convert(
          fahrenheit,
          (value) => ((value - 32) * 5) / 9,
        );
      }} />
    <div class="temperature-converter-column-bottom-row">
      Fahrenheit
    </div>
  </label>
</div>

<style>
  .temperature-converter {
    display: flex;
  }

  .temperature-converter-column-top-row {
    align-items: center;
    display: flex;
    font-size: 18px;
    height: 24px;
    padding: 4px;
    text-align: center;
  }

  .temperature-converter-column-bottom-row {
    padding: 4px;
    text-align: center;
  }
</style>
