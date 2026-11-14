function sortItems(items) {
  const directories = items
    .filter((item) => Array.isArray(item.children))
    .sort((a, b) => a.name.localeCompare(b.name));
  const files = items
    .filter((item) => !Array.isArray(item.children))
    .sort((a, b) => a.name.localeCompare(b.name));
  return [...directories, ...files];
}

export default function createFileExplorer(container, data) {
  const expandedPaths = new Set();
  const list = document.createElement('ul');
  list.className = 'file-list';
  container.append(list);

  function flatten(items, level, parentPath) {
    const rows = [];
    sortItems(items).forEach((file, index) => {
      const path = parentPath + '-' + index;
      rows.push({ file, level, path });
      if (Array.isArray(file.children) && expandedPaths.has(path)) {
        rows.push(...flatten(file.children, level + 1, path));
      }
    });
    return rows;
  }

  function render(focusedPath) {
    list.replaceChildren();
    flatten(data, 1, 'root').forEach(({ file, level, path }) => {
      const isDirectory = Array.isArray(file.children);
      const item = document.createElement('li');
      item.className = 'file-item';
      item.style.paddingLeft = (level - 1) * 16 + 'px';

      if (isDirectory) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'file-item-button file-item-button--directory';
        button.dataset.path = path;
        const label = document.createElement('span');
        label.textContent = file.name;
        button.append(label);

        const expanded = expandedPaths.has(path);
        button.append(document.createTextNode(expanded ? ' [-]' : ' [+]'));
        button.addEventListener('click', () => {
          if (expanded) {
            expandedPaths.delete(path);
          } else {
            expandedPaths.add(path);
          }
          render(path);
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
    if (focusedPath != null) {
      list.querySelector(`[data-path="${focusedPath}"]`).focus();
    }
  }

  render();
}
