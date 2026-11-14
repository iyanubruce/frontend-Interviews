import './styles.css';

(() => {
  const FULL_ROTATION_DEGREES = 360;

  function padTwoDigit(number) {
    return number >= 10 ? String(number) : `0${number}`;
  }

  function hand() {
    const $hand = document.createElement('div');
    $hand.classList.add('clock-hand');
    $hand.setAttribute('aria-hidden', true);
    return $hand;
  }

  function clock($rootEl, size) {
    const $timeEl = document.createElement('time');
    $timeEl.classList.add('clock');
    $timeEl.setAttribute('style', `--size: ${size}px`);

    const $hourHand = hand();
    const $minuteHand = hand();
    const $secondHand = hand();
    $timeEl.append($hourHand, $minuteHand, $secondHand);
    $rootEl.replaceChildren($timeEl);

    function update() {
      const date = new Date();
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const seconds = date.getSeconds();

      const secondsPercentage = seconds / 60;
      // To have second-level precision in the minute hand angle.
      const minutesPercentage = (minutes + secondsPercentage) / 60;
      // To have minute-level precision in the hour hand angle.
      const hoursPercentage = ((hours % 12) + minutesPercentage) / 12;

      const hourAngle = hoursPercentage * FULL_ROTATION_DEGREES;
      const minutesAngle = minutesPercentage * FULL_ROTATION_DEGREES;
      const secondsAngle = secondsPercentage * FULL_ROTATION_DEGREES;

      const dateTimeDisplay = `${padTwoDigit(hours)}:${padTwoDigit(
        minutes,
      )}:${padTwoDigit(seconds)}`;

      $timeEl.dateTime = dateTimeDisplay;
      $timeEl.setAttribute('aria-label', `Current time: ${dateTimeDisplay}`);
      $hourHand.style.transform = `rotate(${hourAngle}deg) scaleY(0.5) scaleX(3)`;
      $minuteHand.style.transform = `rotate(${minutesAngle}deg) scaleY(0.9) scaleX(2)`;
      $secondHand.style.transform = `rotate(${secondsAngle}deg) scaleY(0.8) scaleX(1)`;
    }

    update();
    const timer = window.setInterval(update, 100);

    return () => {
      window.clearInterval(timer);
      $rootEl.replaceChildren();
    };
  }

  const destroyClock = clock(document.getElementById('clock'), 200);

  // A caller can use the returned function when removing the clock.
  // This demo also cleans up when the document unloads.
  window.addEventListener('beforeunload', destroyClock);
})();
