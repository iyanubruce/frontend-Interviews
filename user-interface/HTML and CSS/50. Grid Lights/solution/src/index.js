import './styles.css';

const config = [
  [1, 1, 1],
  [1, 0, 1],
  [1, 1, 1],
];
const active = [];
let deactivating = false;
const grid = document.querySelector('.grid');
grid.style.gridTemplateColumns = `repeat(${config[0].length}, 1fr)`;

config.flat().forEach((enabled, index) => {
  if (!enabled) {
    grid.append(document.createElement('span'));
    return;
  }
  const button = document.createElement('button');
  button.className = 'cell';
  button.type = 'button';
  button.setAttribute('aria-label', `Cell ${index}`);
  button.addEventListener('click', () => {
    if (deactivating || active.includes(index)) return;
    active.push(index);
    render();
    if (active.length === config.flat().filter(Boolean).length) deactivate();
  });
  grid.append(button);
});

function render() {
  [...grid.querySelectorAll('.cell')].forEach((cell) => {
    const index = Number(cell.getAttribute('aria-label').split(' ')[1]);
    cell.classList.toggle('cell--activated', active.includes(index));
    cell.disabled = deactivating || active.includes(index);
  });
  document.getElementById('order').textContent = active.join(', ');
}

function deactivate() {
  deactivating = true;
  render();
  const timer = setInterval(() => {
    active.pop();
    if (active.length === 0) {
      clearInterval(timer);
      deactivating = false;
    }
    render();
  }, 300);
}
render();
