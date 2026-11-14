<script>

  const TODAY = formatDate(new Date());

  let flightOption = 'one-way';
  let departureDate = getTomorrow();
  let returnDate = departureDate;

  function formatDate(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1)
      .toString()
      .padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return [year, month, day].join('-');
  }

  function getTomorrow() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return formatDate(tomorrow);
  }

  function onDepartureChange() {
    if (returnDate < departureDate) {
      returnDate = departureDate;
    }
  }
</script>

<div>
  <form
    on:submit={(event) => {
      event.preventDefault();
      if (flightOption === 'one-way') {
        alert(
          `You have booked a one-way flight on ${departureDate}`,
        );
        return;
      }

      alert(
        `You have booked a round-trip flight, departing on ${departureDate} and returning on ${returnDate}`,
      );
    }}>
    <label for="flight-option">Flight type</label>
    <select id="flight-option" bind:value={flightOption}>
      <option value="one-way">One-way flight</option>
      <option value="round-trip">Round-trip flight</option>
    </select>
    <label for="departure-date">Departure date</label>
    <input
      id="departure-date"
      type="date"
      required
      bind:value={departureDate}
      on:change={onDepartureChange}
      min={TODAY} />

    {#if flightOption === 'round-trip'}
      <label for="return-date">Return date</label>
      <input
        id="return-date"
        type="date"
        required
        bind:value={returnDate}
        min={departureDate} />
    {/if}
    <button>Book</button>
  </form>
</div>

<style>
  form {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin: 0 auto;
    max-width: 320px;
  }
</style>
