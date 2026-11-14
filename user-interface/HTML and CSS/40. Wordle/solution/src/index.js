import './styles.css';

const GUESS_STATE = Object.freeze({
  INDETERMINATE: 'INDETERMINATE',
  ABSENT: 'ABSENT',
  PRESENT: 'PRESENT',
  CORRECT: 'CORRECT',
});
const GAME_STATE = Object.freeze({
  IN_PROGRESS: 'IN_PROGRESS',
  GUESSED_CORRECTLY: 'GUESSED_CORRECTLY',
  NO_MORE_GUESSES: 'NO_MORE_GUESSES',
});
const STATE_PRIORITY = Object.freeze({
  INDETERMINATE: 1,
  ABSENT: 2,
  PRESENT: 3,
  CORRECT: 4,
});
const KEYBOARD_LAYOUT = Object.freeze([
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Backspace'],
]);
const WORDS = Object.freeze([
  'APPLE',
  'BEAST',
  'FAINT',
  'FEAST',
  'FRUIT',
  'GAMES',
  'PAINT',
  'PASTE',
  'TOWER',
  'REACT',
]);
const MAX_ATTEMPTS = 6;
const LETTERS_PER_WORD = 5;

const gridElement = document.querySelector('#grid');
const keyboardElement = document.querySelector('#keyboard');
const resultElement = document.querySelector('#result');

let wordOfTheDay;
let gameState;
let grid;
let row;
let column;
let keyboardState;

function createGrid() {
  return Array.from({ length: MAX_ATTEMPTS }, () =>
    Array.from({ length: LETTERS_PER_WORD }, () => ({
      char: '',
      state: GUESS_STATE.INDETERMINATE,
    })),
  );
}

function chooseWord() {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

function classForState(state) {
  return state == null || state === GUESS_STATE.INDETERMINATE
    ? ''
    : `guess--${state.toLowerCase()}`;
}

function render() {
  gridElement.style.gridTemplateColumns = `repeat(${LETTERS_PER_WORD}, var(--size))`;
  gridElement.style.gridTemplateRows = `repeat(${MAX_ATTEMPTS}, var(--size))`;
  gridElement.innerHTML = grid
    .flatMap((guessRow, rowIndex) =>
      guessRow.map((cell, columnIndex) => {
        const finalClass =
          cell.state === GUESS_STATE.INDETERMINATE
            ? ''
            : `grid-cell--final ${classForState(cell.state)}`;
        return `<div
          class="grid-cell ${cell.char ? 'grid-cell--filled' : ''} ${finalClass}"
          aria-label="Row ${rowIndex + 1}, column ${columnIndex + 1}${cell.char ? `: ${cell.char}` : ''}"
          style="transition-delay: ${columnIndex * 50}ms"
        >${cell.char}</div>`;
      }),
    )
    .join('');

  keyboardElement.innerHTML = KEYBOARD_LAYOUT.map(
    (keyboardRow) =>
      `<div class="keyboard-row">${keyboardRow
        .map((key) => {
          const visibleLabel =
            key === 'Enter' ? 'ENTER' : key === 'Backspace' ? 'DEL' : key;
          return `<button
          class="keyboard-row__button ${classForState(keyboardState[key])}"
          data-key="${key}"
          type="button"
          aria-label="${key}"
        >${visibleLabel}</button>`;
        })
        .join('')}</div>`,
  ).join('');

  if (gameState === GAME_STATE.IN_PROGRESS) {
    resultElement.innerHTML = '';
  } else {
    const message =
      gameState === GAME_STATE.GUESSED_CORRECTLY
        ? 'Congratulations 🎉'
        : `Word: ${wordOfTheDay}`;
    resultElement.innerHTML = `<strong>${message}</strong>
      <button type="button" class="reset-button" data-reset>Reset</button>`;
  }
}

function countLetters(word) {
  const frequencies = new Map();
  for (const letter of word) {
    const currentFrequency = frequencies.get(letter);
    frequencies.set(
      letter,
      (currentFrequency == null ? 0 : currentFrequency) + 1,
    );
  }
  return frequencies;
}

function updateKeyboardState(letter, nextState) {
  const currentState =
    keyboardState[letter] == null
      ? GUESS_STATE.INDETERMINATE
      : keyboardState[letter];
  if (STATE_PRIORITY[nextState] > STATE_PRIORITY[currentState]) {
    keyboardState[letter] = nextState;
  }
}

function addLetter(letter) {
  if (column >= LETTERS_PER_WORD - 1) {
    return;
  }
  column += 1;
  grid[row][column].char = letter;
  render();
}

function deleteLetter() {
  if (column < 0) {
    return;
  }
  grid[row][column].char = '';
  column -= 1;
  render();
}

function submitGuess() {
  if (column !== LETTERS_PER_WORD - 1) {
    return;
  }

  const guess = grid[row].map((cell) => cell.char).join('');
  const frequencies = countLetters(wordOfTheDay);
  const remainingIndices = [];
  let correctCount = 0;

  for (let index = 0; index < LETTERS_PER_WORD; index += 1) {
    const letter = guess[index];
    if (letter === wordOfTheDay[index]) {
      grid[row][index].state = GUESS_STATE.CORRECT;
      frequencies.set(letter, frequencies.get(letter) - 1);
      updateKeyboardState(letter, GUESS_STATE.CORRECT);
      correctCount += 1;
    } else {
      remainingIndices.push(index);
    }
  }

  for (const index of remainingIndices) {
    const letter = guess[index];
    const state =
      (frequencies.get(letter) == null ? 0 : frequencies.get(letter)) > 0
        ? GUESS_STATE.PRESENT
        : GUESS_STATE.ABSENT;
    grid[row][index].state = state;
    updateKeyboardState(letter, state);
    if (state === GUESS_STATE.PRESENT) {
      frequencies.set(letter, frequencies.get(letter) - 1);
    }
  }

  if (correctCount === LETTERS_PER_WORD) {
    gameState = GAME_STATE.GUESSED_CORRECTLY;
  } else if (row === MAX_ATTEMPTS - 1) {
    gameState = GAME_STATE.NO_MORE_GUESSES;
  } else {
    row += 1;
    column = -1;
  }
  render();
}

function handleKey(key) {
  if (gameState !== GAME_STATE.IN_PROGRESS) {
    return;
  }

  if (key === 'Enter') {
    submitGuess();
  } else if (key === 'Backspace') {
    deleteLetter();
  } else if (/^[a-z]$/i.test(key)) {
    addLetter(key.toUpperCase());
  }
}

function resetGame() {
  wordOfTheDay = chooseWord();
  gameState = GAME_STATE.IN_PROGRESS;
  grid = createGrid();
  row = 0;
  column = -1;
  keyboardState = {};
  console.log(`[DEBUG]: Word of the day is: ${wordOfTheDay}`);
  render();
}

keyboardElement.addEventListener('click', (event) => {
  const key = event.target.closest('[data-key]');
  if (key != null && keyboardElement.contains(key)) {
    handleKey(key.dataset.key);
  }
});

resultElement.addEventListener('click', (event) => {
  if (event.target.closest('[data-reset]') != null) {
    resetGame();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.altKey || event.ctrlKey || event.metaKey) {
    return;
  }
  if (
    event.target !== document.body &&
    (event.key === 'Enter' || event.key === ' ')
  ) {
    return;
  }
  handleKey(event.key);
});

resetGame();
34