import './styles.css';

let left = ['HTML', 'JavaScript', 'CSS', 'TypeScript'].map((label) => ({
  label,
  checked: false,
}));
let right = ['React', 'Angular', 'Vue', 'Svelte'].map((label) => ({
  label,
  checked: false,
}));
const app = document.getElementById('app');

function selectedCount(items) {
  return items.filter((item) => item.checked).length;
}
function listState(items) {
  const count = selectedCount(items);
  return count === 0 ? 'none' : count === items.length ? 'all' : 'partial';
}
function escapeHtml(value) {
  const element = document.createElement('span');
  element.textContent = value;
  return element.innerHTML;
}

function listMarkup(items, side) {
  const state = listState(items);
  return `<section class="transfer-list__section">
    <form data-add-side="${side}"><label for="${side}-new-item">Add item to ${side} list</label><input id="${side}-new-item" name="item" /></form><hr />
    <div class="transfer-list__section__items__item">
      <input data-bulk-side="${side}" id="${side}-all" type="checkbox" ${state === 'all' ? 'checked' : ''} ${items.length ? '' : 'disabled'} />
      <label for="${side}-all">${selectedCount(items)} / ${items.length} Selected</label>
    </div><hr />
    <ul class="transfer-list__section__items">${items
      .map(
        (item, index) => `
      <li><div class="transfer-list__section__items__item">
        <input data-side="${side}" data-index="${index}" id="${side}-${index}" type="checkbox" ${item.checked ? 'checked' : ''} />
        <label for="${side}-${index}">${escapeHtml(item.label)}</label>
      </div></li>`,
      )
      .join('')}</ul>
  </section>`;
}

function render() {
  app.innerHTML = `<div class="transfer-list">
    ${listMarkup(left, 'left')}
    <div class="transfer-list__actions">
      <button aria-label="Transfer selected items to left list" data-action="left" ${selectedCount(right) ? '' : 'disabled'}><span aria-hidden="true">&lt;</span></button>
      <button aria-label="Transfer selected items to right list" data-action="right" ${selectedCount(left) ? '' : 'disabled'}><span aria-hidden="true">&gt;</span></button>
    </div>
    ${listMarkup(right, 'right')}
  </div>`;
  app.querySelectorAll('[data-bulk-side]').forEach((checkbox) => {
    const items = checkbox.dataset.bulkSide === 'left' ? left : right;
    checkbox.indeterminate = listState(items) === 'partial';
  });
}

function moveSelected(source, destination) {
  destination.push(...source.filter((item) => item.checked));
  return source.filter((item) => !item.checked);
}

app.addEventListener('submit', (event) => {
  event.preventDefault();
  const side = event.target.dataset.addSide;
  const input = event.target.elements.namedItem('item');
  const label = input.value.trim();
  if (!label) return;
  (side === 'left' ? left : right).push({ label, checked: false });
  render();
  app.querySelector(`[data-add-side="${side}"] input`).focus();
});

app.addEventListener('change', (event) => {
  const side = event.target.dataset.side;
  const bulkSide = event.target.dataset.bulkSide;
  if (side) {
    const items = side === 'left' ? left : right;
    items[Number(event.target.dataset.index)].checked = event.target.checked;
  }
  if (bulkSide) {
    const items = bulkSide === 'left' ? left : right;
    const checked = listState(items) !== 'all';
    items.forEach((item) => {
      item.checked = checked;
    });
  }
  if (!side && !bulkSide) return;
  render();
});

app.addEventListener('click', (event) => {
  const actionElement = event.target.closest('[data-action]');
  const action =
    actionElement == null ? undefined : actionElement.dataset.action;
  if (action === 'left') right = moveSelected(right, left);
  if (action === 'right') left = moveSelected(left, right);
  if (action) render();
});
render();
