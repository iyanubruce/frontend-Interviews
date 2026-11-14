import './styles.css';

let counter = 0;
let history = [];
let redoHistory = [];
const operations = {
  '/2': (value) => value / 2,
  '-1': (value) => value - 1,
  '+1': (value) => value + 1,
  x2: (value) => value * 2,
};

function render() {
  document.querySelector('output').value = counter;
  document.querySelector('[data-action="undo"]').disabled =
    history.length === 0;
  document.querySelector('[data-action="redo"]').disabled =
    redoHistory.length === 0;
  const tbody = document.querySelector('tbody');
  tbody.replaceChildren(
    ...history.map((entry) => {
      const row = document.createElement('tr');
      [entry.operation, entry.oldCounter, entry.newCounter].forEach((value) => {
        const cell = document.createElement('td');
        cell.textContent = value;
        row.append(cell);
      });
      return row;
    }),
  );
  document.querySelector('table').hidden = history.length === 0;
}

document.addEventListener('click', (event) => {
  const operation = event.target.dataset.operation;
  const action = event.target.dataset.action;
  if (operation) {
    const oldCounter = counter;
    counter = operations[operation](counter);
    history.unshift({ operation, oldCounter, newCounter: counter });
    redoHistory = [];
  }
  if (action === 'undo' && history.length) {
    const entry = history.shift();
    counter = entry.oldCounter;
    redoHistory.unshift(entry);
  }
  if (action === 'redo' && redoHistory.length) {
    const entry = redoHistory.shift();
    counter = entry.newCounter;
    history.unshift(entry);
  }
  if (action === 'reset') {
    counter = 0;
    history = [];
    redoHistory = [];
  }
  if (operation || action) render();
});
render();
