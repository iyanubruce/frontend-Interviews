<script setup>
import { ref } from 'vue';

const celsius = ref('');
const fahrenheit = ref('');

function format(number) {
  return String(Number(number.toFixed(4)));
}

function convert(value, destination, calculateValue) {
  if (value.trim() === '') {
    destination.value = '';
    return;
  }

  const numericValue = Number(value);
  const result = calculateValue(numericValue);
  destination.value =
    Number.isFinite(numericValue) && Number.isFinite(result)
      ? format(result)
      : '';
}

function setCelsius(event) {
  const newValue = event.target.value;
  celsius.value = newValue;
  convert(newValue, fahrenheit, (value) => (value * 9) / 5 + 32);
}

function setFahrenheit(event) {
  const newValue = event.target.value;
  fahrenheit.value = newValue;
  convert(newValue, celsius, (value) => ((value - 32) * 5) / 9);
}
</script>

<template>
  <div>
    <div class="temperature-converter">
      <!-- Use a label for better a11y. -->
      <label class="temperature-converter-column">
        <input
          class="temperature-converter-column-top-row"
          inputmode="decimal"
          type="text"
          :value="celsius"
          @input="setCelsius" />
        <div class="temperature-converter-column-bottom-row">Celsius</div>
      </label>
      <div class="temperature-converter-column">
        <div class="temperature-converter-column-top-row">=</div>
      </div>
      <!-- Use a label for better a11y. -->
      <label class="temperature-converter-column">
        <input
          class="temperature-converter-column-top-row"
          inputmode="decimal"
          type="text"
          :value="fahrenheit"
          @input="setFahrenheit" />
        <div class="temperature-converter-column-bottom-row">Fahrenheit</div>
      </label>
    </div>
  </div>
</template>

<style>
.temperature-converter {
  display: flex;
}

.temperature-converter .temperature-converter-column-top-row {
  align-items: center;
  display: flex;
  font-size: 18px;
  height: 24px;
  padding: 4px;
  text-align: center;
}

.temperature-converter .temperature-converter-column-bottom-row {
  padding: 4px;
  text-align: center;
}
</style>
