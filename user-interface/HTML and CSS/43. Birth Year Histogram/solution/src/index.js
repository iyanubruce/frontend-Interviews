import './styles.css';

const COUNT = 200;
const MIN = 1950;
const MAX = 2019;
const BUCKET_SIZE = 10;
const Y_AXIS_SCALE = 10;
const URL = `https://www.random.org/integers/?num=${COUNT}&min=${MIN}&max=${MAX}&col=1&base=10&format=plain&rnd=new`;

const bucketLabels = Array.from(
  { length: Math.ceil((MAX - MIN) / BUCKET_SIZE) },
  (_, index) => MIN + index * BUCKET_SIZE,
);

const app = document.querySelector('#app');
app.innerHTML = `
  <div class="wrapper">
    <div class="status" role="status"></div>
    <div class="chart" role="img" aria-label="Birth years grouped by decade">
      <div class="chart__y-axis">
        <div class="chart__y-axis__items"></div>
        <div class="chart__y-axis__zero">0</div>
      </div>
      <div class="chart__main">
        <div class="chart__main__bars"></div>
        <div class="chart__x-axis"></div>
      </div>
    </div>
    <button type="button">Refresh</button>
  </div>
`;

const status = app.querySelector('.status');
const chart = app.querySelector('.chart');
const yAxisItems = app.querySelector('.chart__y-axis__items');
const bars = app.querySelector('.chart__main__bars');
const xAxis = app.querySelector('.chart__x-axis');
const refreshButton = app.querySelector('button');
let activeController = null;

bucketLabels.forEach((bucket) => {
  const label = document.createElement('div');
  label.className = 'chart__x-axis__item';
  label.textContent = String(bucket);
  xAxis.append(label);
});

function groupIntoBuckets(years) {
  return years.reduce((frequency, year) => {
    const bucket = Math.floor(year / BUCKET_SIZE) * BUCKET_SIZE;
    frequency[bucket] = (frequency[bucket] == null ? 0 : frequency[bucket]) + 1;
    return frequency;
  }, {});
}

function render(frequency) {
  const maxFrequency = Math.max(0, ...Object.values(frequency));
  const maxYAxisValue = Math.max(
    Y_AXIS_SCALE,
    Math.min(Math.ceil(maxFrequency / Y_AXIS_SCALE) * Y_AXIS_SCALE, COUNT),
  );

  yAxisItems.replaceChildren(
    ...Array.from({ length: maxYAxisValue / Y_AXIS_SCALE }, (_, index) => {
      const label = document.createElement('div');
      label.className = 'chart__y-axis__item';
      label.textContent = String((index + 1) * Y_AXIS_SCALE);
      return label;
    }),
  );

  bars.replaceChildren(
    ...bucketLabels.map((bucket) => {
      const bar = document.createElement('div');
      const count = frequency[bucket] == null ? 0 : frequency[bucket];
      bar.className = 'chart__main__bars__item';
      bar.style.height = `${(count / maxYAxisValue) * 100}%`;
      bar.title = `${bucket}s: ${count}`;
      return bar;
    }),
  );

  chart.setAttribute(
    'aria-label',
    `Birth years grouped by decade: ${bucketLabels
      .map(
        (bucket) =>
          `${bucket}s, ${frequency[bucket] == null ? 0 : frequency[bucket]}`,
      )
      .join('; ')}`,
  );
}

async function fetchData() {
  if (activeController != null) {
    activeController.abort();
  }
  activeController = new AbortController();
  const controller = activeController;
  refreshButton.disabled = true;
  status.textContent = 'Loading…';
  render({});

  try {
    const response = await fetch(URL, { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const years = (await response.text())
      .split('\n')
      .filter(Boolean)
      .map(Number);
    render(groupIntoBuckets(years));
    status.textContent = '';
  } catch (error) {
    if (error.name !== 'AbortError') {
      status.textContent = 'Unable to load birth-year data.';
    }
  } finally {
    if (activeController === controller) {
      activeController = null;
      refreshButton.disabled = false;
    }
  }
}

refreshButton.addEventListener('click', fetchData);
fetchData();
33