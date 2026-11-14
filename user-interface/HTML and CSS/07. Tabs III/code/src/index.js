import './styles.css';

const tablist = document.querySelector('[role="tablist"]');
const tabs = [...tablist.querySelectorAll('[role="tab"]')];

function activateTab(tab, moveFocus = false) {
  tabs.forEach((item) => {
    const active = item === tab;
    item.setAttribute('aria-selected', String(active));
    item.tabIndex = active ? 0 : -1;
    item.classList.toggle('tabs-list-item--active', active);
    document.getElementById(item.getAttribute('aria-controls')).hidden =
      !active;
  });
  if (moveFocus) tab.focus();
}

tablist.addEventListener('click', (event) => {
  const tab = event.target.closest('[role="tab"]');
  if (tab) activateTab(tab);
});
