import './styles.css';

const checkboxData = [
  {
    id: 1,
    name: 'Electronics',
    checked: false,
    children: [
      {
        id: 2,
        name: 'Mobile phones',
        checked: false,
        children: [
          { id: 3, name: 'iPhone', checked: false },
          { id: 4, name: 'Android', checked: false },
        ],
      },
      {
        id: 5,
        name: 'Laptops',
        checked: false,
        children: [
          { id: 6, name: 'MacBook', checked: false },
          { id: 7, name: 'Surface Pro', checked: false },
        ],
      },
    ],
  },
  {
    id: 8,
    name: 'Books',
    checked: false,
    children: [
      { id: 9, name: 'Fiction', checked: false },
      { id: 10, name: 'Non-fiction', checked: false },
    ],
  },
  { id: 11, name: 'Toys', checked: false },
];

function updateDescendants(item, checked) {
  item.checked = checked;
  if (item.children != null) {
    item.children.forEach((child) => updateDescendants(child, checked));
  }
}

function resolveStates(items) {
  items.forEach((item) => {
    if (item.children == null || item.children.length === 0) return;
    resolveStates(item.children);

    if (item.children.every((child) => child.checked === true)) {
      item.checked = true;
    } else if (item.children.every((child) => !child.checked)) {
      item.checked = false;
    } else {
      item.checked = 'indeterminate';
    }
  });
}

const app = document.querySelector('#app');

function createList(items) {
  const list = document.createElement('ul');

  items.forEach((item) => {
    const listItem = document.createElement('li');
    const label = document.createElement('label');
    label.className = 'checkbox';

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.dataset.id = String(item.id);
    input.checked = item.checked === true;
    input.indeterminate = item.checked === 'indeterminate';
    input.addEventListener('change', () => {
      updateDescendants(item, input.checked);
      resolveStates(checkboxData);
      render(item.id);
    });

    label.append(input, document.createTextNode(item.name));
    listItem.append(label);
    if (item.children != null && item.children.length > 0) {
      listItem.append(createList(item.children));
    }
    list.append(listItem);
  });

  return list;
}

function render(focusedId) {
  app.replaceChildren(createList(checkboxData));
  if (focusedId != null) {
    const focusedElement = app.querySelector(`[data-id="${focusedId}"]`);
    if (focusedElement != null) {
      focusedElement.focus();
    }
  }
}

resolveStates(checkboxData);
render();
