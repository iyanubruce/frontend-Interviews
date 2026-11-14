import './styles.css';

const positions = {
  1: ['dot--center'],
  2: ['dot--top-right', 'dot--bottom-left'],
  3: ['dot--top-right', 'dot--center', 'dot--bottom-left'],
  4: [
    'dot--top-left',
    'dot--top-right',
    'dot--bottom-left',
    'dot--bottom-right',
  ],
  5: [
    'dot--top-left',
    'dot--top-right',
    'dot--center',
    'dot--bottom-left',
    'dot--bottom-right',
  ],
  6: [
    'dot--top-left',
    'dot--top-right',
    'dot--center-left',
    'dot--center-right',
    'dot--bottom-left',
    'dot--bottom-right',
  ],
};
const output = document.querySelector('.dice-list');

document.querySelector('form').addEventListener('submit', (event) => {
  event.preventDefault();
  const count = Number(new FormData(event.currentTarget).get('dice-count'));
  const values = Array.from(
    { length: count },
    () => Math.floor(Math.random() * 6) + 1,
  );
  const dice = values.map((value) => {
    const element = document.createElement('div');
    element.className = 'dice';
    element.setAttribute('aria-label', `Die showing ${value}`);
    const dots = document.createElement('div');
    dots.className = 'dots';
    positions[value].forEach((position) => {
      const dot = document.createElement('span');
      dot.className = `dot ${position}`;
      dots.append(dot);
    });
    element.append(dots);
    return element;
  });
  const announcement = document.createElement('span');
  announcement.className = 'sr-only';
  announcement.textContent = `Roll results: ${values.join(', ')}`;
  output.replaceChildren(...dice, announcement);
  output.hidden = false;
});
