import './styles.css';

const ROWS = 4;
const COLUMNS = 4;
const MATCH_COUNT = 2;
const DELAY = 2000;
const EMOJIS = [
  '🐵',
  '🐶',
  '🦊',
  '🐱',
  '🦁',
  '🐯',
  '🐴',
  '🦄',
  '🦓',
  '🦌',
  '🐮',
  '🐷',
  '🐭',
  '🐹',
  '🐻',
  '🐨',
  '🐼',
  '🐽',
  '🐸',
  '🐰',
  '🐙',
];

const totalCount = ROWS * COLUMNS;
const app = document.querySelector('#app');
let cards;
let flipped;
let matched;
let waitTimer;
let gameCompleted;

function shuffle(items) {
  for (let index = items.length - 1; index > 0; index--) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [items[index], items[randomIndex]] = [items[randomIndex], items[index]];
  }
  return items;
}

function generateCards() {
  if (MATCH_COUNT < 2 || totalCount % MATCH_COUNT !== 0) {
    throw new Error('The board cannot be divided into matching groups.');
  }

  const groupCount = totalCount / MATCH_COUNT;
  if (groupCount > EMOJIS.length) throw new Error('Not enough emojis.');

  return shuffle(
    EMOJIS.slice(0, groupCount).flatMap((emoji) =>
      Array(MATCH_COUNT).fill(emoji),
    ),
  );
}

function clearWaitTimer() {
  if (waitTimer != null) window.clearTimeout(waitTimer);
  waitTimer = null;
}

function resetGame() {
  clearWaitTimer();
  cards = generateCards();
  flipped = [];
  matched = new Set();
  gameCompleted = false;
  render();
}

function flip(index) {
  if (matched.has(cards[index]) || flipped.includes(index)) return;

  if (waitTimer != null) {
    clearWaitTimer();
    flipped = [];
  }

  flipped = [...flipped, index];
  render();

  if (flipped.length < MATCH_COUNT) return;

  const firstEmoji = cards[flipped[0]];
  if (flipped.every((cardIndex) => cards[cardIndex] === firstEmoji)) {
    matched = new Set(matched).add(firstEmoji);
    flipped = [];
    gameCompleted = matched.size * MATCH_COUNT === totalCount;
    render();
    return;
  }

  waitTimer = window.setTimeout(() => {
    waitTimer = null;
    flipped = [];
    render();
  }, DELAY);
}

function render() {
  app.replaceChildren();
  const container = document.createElement('div');
  container.className = 'app';

  const grid = document.createElement('div');
  grid.className = 'grid';
  grid.style.gridTemplateColumns = `repeat(${COLUMNS}, var(--size))`;
  grid.style.gridTemplateRows = `repeat(${ROWS}, var(--size))`;

  cards.forEach((emoji, index) => {
    const isMatched = matched.has(emoji);
    const isFlipped = flipped.includes(index);
    const card = document.createElement('button');
    card.type = 'button';
    card.className = `card${isMatched ? ' card--revealed' : ''}`;
    card.disabled = isMatched || isFlipped;
    card.textContent = isMatched || isFlipped ? emoji : '';
    card.setAttribute(
      'aria-label',
      isMatched || isFlipped
        ? `Card ${index + 1}: ${emoji}`
        : `Card ${index + 1}: face down`,
    );
    card.addEventListener('click', () => flip(index));
    grid.append(card);
  });

  container.append(grid);

  if (gameCompleted) {
    const playAgain = document.createElement('button');
    playAgain.type = 'button';
    playAgain.textContent = 'Play Again';
    playAgain.addEventListener('click', resetGame);
    container.append(playAgain);
  }

  app.append(container);
}

resetGame();
34:T11b4,var Component=(()=>{var y=Object.