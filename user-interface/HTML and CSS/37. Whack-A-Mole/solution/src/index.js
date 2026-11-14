import './styles.css';

const ROWS = 3;
const COLUMNS = 3;
const ROUND_DURATION = 15;
const MOLES_AT_ONCE = 1;
const MOLE_INTERVAL = 1500;
const MOLE_HEAD_URL =
  'https://www.greatfrontend.com/img/questions/whack-a-mole/mole-head.webp';
const MOLE_HILL_URL =
  'https://www.greatfrontend.com/img/questions/whack-a-mole/mole-hill.webp';

const grid = document.querySelector('#grid');
const startButton = document.querySelector('#start');
const playAgainButton = document.querySelector('#play-again');
const roundInformation = document.querySelector('#round-information');
const scoreElement = document.querySelector('#score');
const timeLeftElement = document.querySelector('#time-left');

let visible = new Set();
let score = 0;
let timeLeft = ROUND_DURATION;
let running = false;
let moleTimerId;
let countdownTimerId;

grid.style.gridTemplateColumns = `repeat(${COLUMNS}, 1fr)`;
grid.style.gridTemplateRows = `repeat(${ROWS}, 1fr)`;
grid.innerHTML = Array.from(
  { length: ROWS * COLUMNS },
  (_, index) => `<button
    class="grid__cell"
    data-index="${index}"
    type="button"
    aria-label="Empty hole ${index + 1}"
  >
    <img
      src="${MOLE_HEAD_URL}"
      alt=""
      class="grid__cell-contents mole-head"
    />
    <img
      src="${MOLE_HILL_URL}"
      alt=""
      class="grid__cell-contents mole-hill"
    />
  </button>`,
).join('');

function shuffle(values) {
  for (let index = values.length - 1; index > 0; index -= 1) {
    const otherIndex = Math.floor(Math.random() * (index + 1));
    [values[index], values[otherIndex]] = [values[otherIndex], values[index]];
  }
  return values;
}

function generateMolePositions() {
  const indices = Array.from({ length: ROWS * COLUMNS }, (_, index) => index);
  return new Set(shuffle(indices).slice(0, MOLES_AT_ONCE));
}

function render() {
  startButton.hidden = score !== null;
  roundInformation.hidden = score === null;
  playAgainButton.hidden = running || score === null;
  scoreElement.textContent = `Score: ${score == null ? 0 : score}`;
  timeLeftElement.textContent = `Time Left: ${timeLeft}`;

  grid.querySelectorAll('[data-index]').forEach((cell) => {
    const index = Number(cell.dataset.index);
    const isVisible = running && visible.has(index);
    cell.disabled = !running;
    cell.setAttribute(
      'aria-label',
      isVisible ? `Whack mole in hole ${index + 1}` : `Empty hole ${index + 1}`,
    );
    cell
      .querySelector('.mole-head')
      .classList.toggle('mole-head--visible', isVisible);
  });
}

function stopTimers() {
  window.clearInterval(moleTimerId);
  window.clearInterval(countdownTimerId);
  moleTimerId = undefined;
  countdownTimerId = undefined;
}

function showMoles() {
  visible = generateMolePositions();
  render();
}

function finishGame() {
  running = false;
  visible = new Set();
  stopTimers();
  render();
}

function startGame() {
  stopTimers();
  visible = new Set();
  score = 0;
  timeLeft = ROUND_DURATION;
  running = true;
  showMoles();

  moleTimerId = window.setInterval(showMoles, MOLE_INTERVAL);
  countdownTimerId = window.setInterval(() => {
    timeLeft -= 1;
    if (timeLeft <= 0) {
      timeLeft = 0;
      finishGame();
      return;
    }
    render();
  }, 1000);

  render();
}

grid.addEventListener('click', (event) => {
  const cell = event.target.closest('[data-index]');
  if (cell == null || !grid.contains(cell) || !running) {
    return;
  }

  const index = Number(cell.dataset.index);
  if (!visible.has(index)) {
    return;
  }

  visible.delete(index);
  score += 1;
  render();
});

startButton.addEventListener('click', startGame);
playAgainButton.addEventListener('click', startGame);
window.addEventListener('beforeunload', stopTimers);

score = null;
render();
