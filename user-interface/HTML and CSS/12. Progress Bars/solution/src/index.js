import './styles.css';

const app = document.querySelector('#app');
app.innerHTML = `
  <div class="wrapper">
    <div><button type="button">Add</button></div>
    <div class="bars"></div>
  </div>
`;

const bars = app.querySelector('.bars');

app.querySelector('button').addEventListener('click', () => {
  const bar = document.createElement('div');
  bar.className = 'bar';
  const fill = document.createElement('div');
  fill.className = 'bar__fill';
  bar.append(fill);
  bars.append(bar);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => fill.classList.add('bar__fill--running'));
  });
});
