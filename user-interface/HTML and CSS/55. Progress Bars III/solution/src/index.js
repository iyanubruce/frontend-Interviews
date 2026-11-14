import './styles.css';

const CONCURRENCY_LIMIT = 3;
const statuses = [];
const app = document.querySelector('#app');
app.innerHTML = `
  <div class="wrapper">
    <div><button type="button">Add</button></div>
    <div class="bars"></div>
  </div>
`;

const barsElement = app.querySelector('.bars');

function startNext() {
  while (
    statuses.filter((status) => status === 'running').length < CONCURRENCY_LIMIT
  ) {
    const nextIndex = statuses.indexOf('waiting');
    if (nextIndex === -1) return;
    statuses[nextIndex] = 'running';
    barsElement.children[nextIndex]
      .querySelector('.bar__fill')
      .classList.add('bar__fill--running');
  }
}

app.querySelector('button').addEventListener('click', () => {
  const index = statuses.push('waiting') - 1;
  const bar = document.createElement('div');
  bar.className = 'bar';
  bar.innerHTML = '<div class="bar__fill"></div>';
  bar.querySelector('.bar__fill').addEventListener(
    'animationend',
    () => {
      if (statuses[index] !== 'running') return;
      statuses[index] = 'complete';
      startNext();
    },
    { once: true },
  );
  barsElement.append(bar);
  startNext();
});
