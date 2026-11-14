import './styles.css';

const ROWS = 10;
const COLUMNS = 10;
const app = document.querySelector('#app');

app.innerHTML = `
  <div class="draggable-area">
    <div class="select-box" aria-hidden="true"></div>
    <div class="grid" role="grid" aria-label="Selectable cells"></div>
  </div>
`;

const area = app.querySelector('.draggable-area');
const grid = app.querySelector('.grid');
const selectionBox = app.querySelector('.select-box');
grid.style.gridTemplateColumns = `repeat(${COLUMNS}, 1fr)`;
grid.style.gridTemplateRows = `repeat(${ROWS}, 1fr)`;

const cells = Array.from({ length: ROWS * COLUMNS }, () => {
  const cell = document.createElement('div');
  cell.className = 'grid__cell';
  cell.setAttribute('role', 'gridcell');
  cell.setAttribute('aria-selected', 'false');
  grid.append(cell);
  return cell;
});

let dragOrigin = null;

function overlaps(a, b) {
  return (
    a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top
  );
}

window.addEventListener('mousedown', (event) => {
  if (event.button !== 0) return;
  dragOrigin = { x: event.pageX, y: event.pageY };
  cells.forEach((cell) => {
    cell.classList.remove('grid__cell--selected');
    cell.setAttribute('aria-selected', 'false');
  });
  selectionBox.style.display = 'block';
});

window.addEventListener('mousemove', (event) => {
  if (dragOrigin == null) return;

  selectionBox.style.left = Math.min(event.pageX, dragOrigin.x) + 'px';
  selectionBox.style.top = Math.min(event.pageY, dragOrigin.y) + 'px';
  selectionBox.style.width = Math.abs(event.pageX - dragOrigin.x) + 'px';
  selectionBox.style.height = Math.abs(event.pageY - dragOrigin.y) + 'px';

  const selectionRect = selectionBox.getBoundingClientRect();
  cells.forEach((cell) => {
    const selected = overlaps(selectionRect, cell.getBoundingClientRect());
    cell.classList.toggle('grid__cell--selected', selected);
    cell.setAttribute('aria-selected', String(selected));
  });
});

window.addEventListener('mouseup', () => {
  dragOrigin = null;
  selectionBox.removeAttribute('style');
});
