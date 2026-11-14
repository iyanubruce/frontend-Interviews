import './styles.css';

const ROWS = 15;
const COLUMNS = 15;
const COLORS = {
  white: '#fff',
  gray: '#e9ecef',
  black: '#000',
  red: '#cc0001',
  orange: '#fb940b',
  yellow: '#ffff01',
  green: '#01cc00',
  teal: '#38d9a9',
  blue: '#228be6',
  purple: '#7950f2',
  beige: '#ff8787',
};

function createPixelArt(app) {
  const gridState = Array(ROWS * COLUMNS).fill(null);
  let mode = 'draw';
  let selectedColor = 'black';
  let isDragging = false;

  app.innerHTML = `
  <div class="app">
    <div class="grid" aria-label="Pixel art canvas"></div>
    <div class="toolbar">
      <div class="toolbar__mode-picker" aria-label="Drawing mode"></div>
      <div class="toolbar__color-picker" aria-label="Drawing color"></div>
    </div>
  </div>
`;

  const grid = app.querySelector('.grid');
  grid.setAttribute('role', 'group');
  const modePicker = app.querySelector('.toolbar__mode-picker');
  const colorPicker = app.querySelector('.toolbar__color-picker');
  const cells = [];

  function mark(index) {
    gridState[index] = mode === 'erase' ? null : selectedColor;
    const cell = cells[index];
    cell.style.backgroundColor =
      gridState[index] == null ? '' : COLORS[gridState[index]];
    cell.setAttribute(
      'aria-label',
      `Pixel row ${Math.floor(index / COLUMNS) + 1}, column ${(index % COLUMNS) + 1}${
        gridState[index] == null ? ', empty' : `, ${gridState[index]}`
      }`,
    );
    cell.setAttribute('aria-pressed', String(gridState[index] != null));
  }

  Array.from({ length: ROWS }, (_, row) => {
    const rowElement = document.createElement('div');
    rowElement.className =
      row % 2 === 0 ? 'grid__row grid__row--even' : 'grid__row grid__row--odd';

    Array.from({ length: COLUMNS }, (_, column) => {
      const index = row * COLUMNS + column;
      const cell = document.createElement('button');
      cell.type = 'button';
      cell.className = 'grid__cell';
      cell.setAttribute(
        'aria-label',
        `Pixel row ${row + 1}, column ${column + 1}, empty`,
      );
      cell.setAttribute('aria-pressed', 'false');
      cell.addEventListener('pointerdown', (event) => {
        if (event.button !== 0) return;
        isDragging = true;
        mark(index);
      });
      cell.addEventListener('pointerenter', () => {
        if (isDragging) mark(index);
      });
      cell.addEventListener('click', () => mark(index));
      cells.push(cell);
      rowElement.append(cell);
    });

    grid.append(rowElement);
  });

  function renderToolbar() {
    modePicker.replaceChildren(
      ...['draw', 'erase'].map((value) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = `toolbar__mode${
          mode === value ? ' toolbar__mode--selected' : ''
        }`;
        button.textContent = value === 'draw' ? 'Draw' : 'Erase';
        button.setAttribute('aria-pressed', String(mode === value));
        button.addEventListener('click', () => {
          mode = value;
          renderToolbar();
        });
        return button;
      }),
    );

    colorPicker.replaceChildren(
      ...Object.entries(COLORS).map(([name, value]) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = `toolbar__color${
          selectedColor === name ? ' toolbar__color--selected' : ''
        }`;
        button.style.backgroundColor = value;
        if (name === 'white' && selectedColor !== name) {
          button.style.borderColor = '#ccc';
        }
        if (name === 'black' && selectedColor === name) {
          button.style.borderColor = '#fff';
          button.style.outline = '2px solid #000';
        }
        button.setAttribute('aria-label', name);
        button.setAttribute('aria-pressed', String(selectedColor === name));
        button.addEventListener('click', () => {
          selectedColor = name;
          mode = 'draw';
          renderToolbar();
        });
        return button;
      }),
    );
  }

  function endDragging() {
    isDragging = false;
  }

  window.addEventListener('pointerup', endDragging);
  window.addEventListener('pointercancel', endDragging);
  window.addEventListener('blur', endDragging);

  renderToolbar();

  function destroy() {
    window.removeEventListener('pointerup', endDragging);
    window.removeEventListener('pointercancel', endDragging);
    window.removeEventListener('blur', endDragging);
    window.removeEventListener('beforeunload', destroy);
    app.replaceChildren();
  }

  return destroy;
}

const destroyPixelArt = createPixelArt(document.querySelector('#app'));
window.addEventListener('beforeunload', destroyPixelArt, { once: true });
