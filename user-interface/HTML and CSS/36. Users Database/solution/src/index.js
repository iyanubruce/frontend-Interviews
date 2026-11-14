import './styles.css';

let nextId = 3;
let selected = '';
let users = [
  { first: 'Hans', last: 'Emil', id: '0' },
  { first: 'Max', last: 'Mustermann', id: '1' },
  { first: 'Roman', last: 'Tisch', id: '2' },
];

const search = document.getElementById('search');
const usersList = document.getElementById('users');
const first = document.getElementById('first');
const last = document.getElementById('last');
const form = document.querySelector('form');
const buttons = Object.fromEntries(
  [...document.querySelectorAll('[data-action]')].map((button) => [
    button.dataset.action,
    button,
  ]),
);

function clearSelection() {
  selected = '';
  first.value = '';
  last.value = '';
}

function render() {
  const query = search.value.toLowerCase();
  const filtered = users.filter((user) =>
    `${user.first} ${user.last}`.toLowerCase().includes(query),
  );
  usersList.replaceChildren(
    ...filtered.map((user) => {
      const option = new Option(`${user.first} ${user.last}`, user.id);
      option.selected = user.id === selected;
      return option;
    }),
  );
  const hasSelection = selected !== '';
  const hasNames = first.value.trim() !== '' && last.value.trim() !== '';
  buttons.create.disabled = hasSelection || !hasNames;
  buttons.update.disabled = !hasSelection || !hasNames;
  buttons.delete.disabled = !hasSelection;
  buttons.cancel.disabled = !hasSelection;
}

search.addEventListener('input', render);
first.addEventListener('input', render);
last.addEventListener('input', render);
usersList.addEventListener('change', () => {
  selected = usersList.value;
  const user = users.find((item) => item.id === selected);
  first.value = user == null ? '' : user.first;
  last.value = user == null ? '' : user.last;
  render();
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const action =
    event.submitter == null ? undefined : event.submitter.dataset.action;
  if (!action) return;
  if (action === 'create') {
    users.push({ first: first.value, last: last.value, id: String(nextId++) });
    clearSelection();
  }
  if (action === 'update') {
    const user = users.find((item) => item.id === selected);
    user.first = first.value;
    user.last = last.value;
  }
  if (action === 'delete') {
    users = users.filter((user) => user.id !== selected);
    clearSelection();
  }
  if (action === 'cancel') clearSelection();
  render();
});

render();
