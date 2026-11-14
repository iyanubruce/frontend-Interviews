function sortItems(items) {
  const directories = items
    .filter((item) => Array.isArray(item.children))
    .sort((a, b) => a.name.localeCompare(b.name));
  const files = items
    .filter((item) => !Array.isArray(item.children))
    .sort((a, b) => a.name.localeCompare(b.name));
  return [...directories, ...files];
}

function createList(items, level, path) {
  const sortedItems = sortItems(items);
  const list = document.createElement('ul');
  list.className = 'file-list';
  list.setAttribute('role', 'group');

  sortedItems.forEach((file, index) => {
    const itemPath = path + '-' + index;
    const isDirectory = Array.isArray(file.children);
    const item = document.createElement('li');
    item.className = 'file-item';
    const labelId = 'file-label-' + itemPath;
    item.setAttribute('role', 'treeitem');
    item.setAttribute('aria-labelledby', labelId);
    item.setAttribute('aria-level', String(level));
    item.setAttribute('aria-setsize', String(sortedItems.length));
    item.setAttribute('aria-posinset', String(index + 1));
    if (isDirectory) {
      item.setAttribute('aria-expanded', 'false');
    }

    const button = document.createElement('button');
    button.type = 'button';
    button.className = [
      'file-item-button',
      isDirectory ? 'file-item-button--directory' : '',
    ]
      .filter(Boolean)
      .join(' ');

    const label = document.createElement('span');
    label.id = labelId;
    label.textContent = file.name;
    button.append(label);

    if (isDirectory) {
      let expanded = false;
      const indicator = document.createTextNode(' [+]');
      button.append(indicator);
      button.addEventListener('click', () => {
        expanded = !expanded;
        indicator.textContent = expanded ? ' [-]' : ' [+]';
        item.setAttribute('aria-expanded', String(expanded));
        const existingList = item.querySelector(':scope > .file-list');
        if (!expanded) {
          if (existingList != null) {
            existingList.remove();
          }
          return;
        }
        if (file.children.length > 0) {
          item.append(createList(file.children, level + 1, itemPath));
        }
      });
    }

    item.append(button);
    list.append(item);
  });

  return list;
}

export default function createFileExplorer(container, data) {
  container.setAttribute('aria-label', 'Files Explorer');
  container.setAttribute('role', 'tree');
  container.append(createList(data, 1, 'root'));
}
