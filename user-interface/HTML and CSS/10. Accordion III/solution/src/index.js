import './styles.css';

const accordion = document.querySelector('.accordion');
const headers = [...accordion.querySelectorAll('[data-accordion-header]')];

accordion.addEventListener('click', (event) => {
  const header = event.target.closest('[data-accordion-header]');
  if (!header) return;
  const expanded = header.getAttribute('aria-expanded') === 'true';
  header.setAttribute('aria-expanded', String(!expanded));
  header
    .querySelector('.accordion-icon')
    .classList.toggle('accordion-icon--rotated', !expanded);
  document.getElementById(header.getAttribute('aria-controls')).hidden =
    expanded;
});

accordion.addEventListener('keydown', (event) => {
  const index = headers.indexOf(event.target);
  if (index < 0) return;
  let nextIndex;
  if (event.key === 'ArrowUp' || event.key === 'ArrowLeft')
    nextIndex = (index - 1 + headers.length) % headers.length;
  if (event.key === 'ArrowDown' || event.key === 'ArrowRight')
    nextIndex = (index + 1) % headers.length;
  if (event.key === 'Home') nextIndex = 0;
  if (event.key === 'End') nextIndex = headers.length - 1;
  if (nextIndex == null) return;
  event.preventDefault();
  headers[nextIndex].focus();
});
