<script setup>
import { ref } from 'vue';

const TODAY = formatDate(new Date());

function formatDate(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  return [year, month, day].join('-');
}

const flightOption = ref('one-way');
const departureDate = ref(getTomorrow());
const returnDate = ref(departureDate.value);

function getTomorrow() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return formatDate(tomorrow);
}

function onDepartureChange() {
  if (returnDate.value < departureDate.value) {
    returnDate.value = departureDate.value;
  }
}

function onSubmit(event) {
  event.preventDefault();
  if (flightOption.value === 'one-way') {
    alert(`You have booked a one-way flight on ${departureDate.value}`);
    return;
  }

  alert(
    `You have booked a round-trip flight, departing on ${departureDate.value} and returning on ${returnDate.value}`,
  );
}
</script>

<template>
  <div>
    <form className="flight-booker" @submit="onSubmit">
      <label for="flight-option">Flight type</label>
      <select id="flight-option" v-model="flightOption">
        <option value="one-way">One-way flight</option>
        <option value="round-trip">Round-trip flight</option>
      </select>
      <label for="departure-date">Departure date</label>
      <input
        id="departure-date"
        type="date"
        required
        v-model="departureDate"
        @change="onDepartureChange"
        :min="TODAY" />
      <label for="return-date" v-show="flightOption === 'round-trip'">
        Return date
      </label>
      <input
        id="return-date"
        type="date"
        required
        :disabled="flightOption !== 'round-trip'"
        v-show="flightOption === 'round-trip'"
        v-model="returnDate"
        :min="departureDate" />
      <button>Book</button>
    </form>
  </div>
</template>

<style>
.flight-booker {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 0 auto;
  max-width: 320px;
}
</style>
