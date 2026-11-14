function sortItems(items) {
  const directories = items
    .filter((item) => Array.isArray(item.children))
    .sort((a, b) => a.name.localeCompare(b.name));
  const files = items
    .filter((item) => !Array.isArray(item.children))
    .sort((a, b) => a.name.localeCompare(b.name));
  return [...directories, ...files];
}

function createList(items, path) {
  const sortedItems = sortItems(items);
  const list = document.createElement('ul');
  list.className = 'file-list';

  sortedItems.forEach((file, index) => {
    const itemPath = path + '-' + index;
    const isDirectory = Array.isArray(file.children);
    const item = document.createElement('li');
    item.className = 'file-item';

    if (isDirectory) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'file-item-button file-item-button--directory';
      const label = document.createElement('span');
      label.textContent = file.name;
      button.append(label);

      let expanded = false;
      const indicator = document.createTextNode(' [+]');
      button.append(indicator);
      button.addEventListener('click', () => {
        expanded = !expanded;
        indicator.textContent = expanded ? ' [-]' : ' [+]';
        const existingList = item.querySelector(':scope > .file-list');
        if (!expanded) {
          if (existingList != null) {
            existingList.remove();
          }
          return;
        }
        if (file.children.length > 0) {
          item.append(createList(file.children, itemPath));
        }
      });
      item.append(button);
    } else {
      const label = document.createElement('span');
      label.className = 'file-item-button';
      label.textContent = file.name;
      item.append(label);
    }
    list.append(item);
  });

  return list;
}

export default function createFileExplorer(container, data) {
  container.append(createList(data, 'root'));
}
