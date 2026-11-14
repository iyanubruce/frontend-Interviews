function sortItems(items) {
  const copy = items.slice();
  copy.sort((a, b) => a.name.localeCompare(b.name));
  copy.sort(
    (a, b) =>
      Number(!Array.isArray(a.children)) - Number(!Array.isArray(b.children)),
  );
  return copy;
}

export default function createFileExplorer(container, data) {
  const list = document.createElement('ul');
  list.className = 'file-list';

  sortItems(data).forEach((file) => {
    const item = document.createElement('li');
    item.className = 'file-item';
    item.textContent = file.name;
    list.append(item);
  });

  container.append(list);
  // TODO: Render nested children and add directory expansion.
}
