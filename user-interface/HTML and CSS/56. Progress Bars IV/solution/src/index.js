import './styles.css';

const CONCURRENCY_LIMIT = 3;
const TICK_MS = 10;
const STEP = 0.5;
let progression = [0];
let timerId = null;
let isProgressing = false;

const app = document.querySelector('#app');
app.innerHTML = `
  <div class="wrapper">
    <div class="buttons">
      <button type="button" data-action="add">Add</button>
      <button type="button" data-action="toggle">Start</button>
      <button type="button" data-action="reset">Reset</button>
    </div>
    <div class="bars"></div>
  </div>
`;

const bars = app.querySelector('.bars');
const toggleButton = app.querySelector('[data-action="toggle"]');

function render() {
  bars.replaceChildren(
    ...progression.map((progress) => {
      const bar = document.createElement('div');
      bar.className = 'bar';
      bar.setAttribute('role', 'progressbar');
      bar.setAttribute('aria-valuemin', '0');
      bar.setAttribute('aria-valuemax', '100');
      bar.setAttribute('aria-valuenow', String(Math.floor(progress)));

      const fill = document.createElement('div');
      fill.className = 'bar__fill';
      fill.style.transform = `scaleX(${progress / 100})`;
      bar.append(fill);
      return bar;
    }),
  );
  toggleButton.textContent = isProgressing ? 'Pause' : 'Start';
}

function stopTimer() {
  if (timerId != null) window.clearInterval(timerId);
  timerId = null;
}

function startTimer() {
  if (timerId != null) return;
  if (progression.every((value) => value >= 100)) return;

  timerId = window.setInterval(() => {
    const unfinished = progression
      .map((value, index) => ({ value, index }))
      .filter(({ value }) => value < 100)
      .slice(0, CONCURRENCY_LIMIT);

    if (unfinished.length === 0) {
      stopTimer();
      return;
    }

    progression = progression.slice();
    unfinished.forEach(({ index }) => {
      progression[index] = Math.min(100, progression[index] + STEP);
    });
    render();
  }, TICK_MS);
}

function start() {
  isProgressing = true;
  startTimer();
  render();
}

function pause() {
  isProgressing = false;
  stopTimer();
  render();
}

app.querySelector('[data-action="add"]').addEventListener('click', () => {
  progression = progression.concat(0);
  if (isProgressing) startTimer();
  render();
});
toggleButton.addEventListener('click', () => {
  if (isProgressing) pause();
  else start();
});
app.querySelector('[data-action="reset"]').addEventListener('click', () => {
  isProgressing = false;
  stopTimer();
  progression = [0];
  render();
});
window.addEventListener('pagehide', stopTimer);

render();
