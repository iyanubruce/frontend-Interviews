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

function listMarkup(items, side) {
  return `<section class="transfer-list__section"><ul class="transfer-list__section__items">${items
    .map(
      (item, index) => `
    <li><div class="transfer-list__section__items__item">
      <input data-side="${side}" data-index="${index}" id="${side}-${index}" type="checkbox" ${item.checked ? 'checked' : ''} />
      <label for="${side}-${index}">${item.label}</label>
    </div></li>`,
    )
    .join('')}</ul></section>`;
}

function hasSelected(items) {
  return items.some((item) => item.checked);
}

function render() {
  app.innerHTML = `<div class="transfer-list">
    ${listMarkup(left, 'left')}
    <div class="transfer-list__actions">
      <button aria-label="Transfer all items to left list" data-action="all-left" ${right.length ? '' : 'disabled'}><span aria-hidden="true">&lt;&lt;</span></button>
      <button aria-label="Transfer selected items to left list" data-action="selected-left" ${hasSelected(right) ? '' : 'disabled'}><span aria-hidden="true">&lt;</span></button>
      <button aria-label="Transfer selected items to right list" data-action="selected-right" ${hasSelected(left) ? '' : 'disabled'}><span aria-hidden="true">&gt;</span></button>
      <button aria-label="Transfer all items to right list" data-action="all-right" ${left.length ? '' : 'disabled'}><span aria-hidden="true">&gt;&gt;</span></button>
    </div>
    ${listMarkup(right, 'right')}
  </div>`;
}

function transfer(source, destination, all) {
  const moving = source.filter((item) => all || item.checked);
  const remaining = source.filter((item) => !(all || item.checked));
  destination.push(...moving);
  return remaining;
}

app.addEventListener('change', (event) => {
  const items = event.target.dataset.side === 'left' ? left : right;
  items[Number(event.target.dataset.index)].checked = event.target.checked;
  render();
});

app.addEventListener('click', (event) => {
  const actionElement = event.target.closest('[data-action]');
  const action =
    actionElement == null ? undefined : actionElement.dataset.action;
  if (action === 'all-left') right = transfer(right, left, true);
  if (action === 'selected-left') right = transfer(right, left, false);
  if (action === 'all-right') left = transfer(left, right, true);
  if (action === 'selected-right') left = transfer(left, right, false);
  if (action) render();
});
render();
