import { useEffect, useRef, useState } from 'react';

const COUNT = 200;
const MIN = 1950;
const MAX = 2019;
const BUCKET_SIZE = 10;
const Y_AXIS_SCALE = 10;

// Extract out the fetching of numbers.
async function fetchYearsData(signal: AbortSignal) {
  const response = await fetch(
    `https://www.random.org/integers/?num=${COUNT}&min=${MIN}&max=${MAX}&col=1&base=10&format=plain&rnd=new`,
    { signal },
  );

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const numbersString = await response.text();
  return (
    numbersString
      .split('\n')
      .filter(Boolean)
      // Converts strings into numbers.
      .map((number) => +number)
  );
}

// Group array of years into decade buckets.
function groupIntoBuckets(years: ReadonlyArray<number>) {
  const frequency: Record<number, number> = {};

  years.forEach((year) => {
    const bucket = Math.floor(year / BUCKET_SIZE) * BUCKET_SIZE;
    frequency[bucket] ||= 0; // Initialize to 0 if undefined or falsy
    frequency[bucket]++;
  });

  return frequency;
}

export default function App() {
  // Object of year bucket to number of data points in that bucket.
  const [bucketFrequency, setBucketFrequency] = useState<
    Record<number, number>
  >({});
  const [status, setStatus] = useState('loading');
  const activeController = useRef<AbortController | null>(null);

  async function fetchData() {
    activeController.current?.abort();
    const controller = new AbortController();
    activeController.current = controller;
    setBucketFrequency({});
    setStatus('loading');

    try {
      const yearsData = await fetchYearsData(controller.signal);
      if (activeController.current !== controller) {
        return;
      }

      setBucketFrequency(groupIntoBuckets(yearsData));
      setStatus('ready');
    } catch (error) {
      if (
        !(error instanceof Error && error.name === 'AbortError') &&
        activeController.current === controller
      ) {
        setStatus('error');
      }
    } finally {
      if (activeController.current === controller) {
        activeController.current = null;
      }
    }
  }

  useEffect(() => {
    fetchData();
    return () => activeController.current?.abort();
  }, []);

  const maxBucketFrequency = Math.max(0, ...Object.values(bucketFrequency));
  const maxYAxisValue = Math.max(
    Y_AXIS_SCALE,
    Math.min(
      Math.ceil(maxBucketFrequency / Y_AXIS_SCALE) * Y_AXIS_SCALE,
      COUNT,
    ),
  );

  const bucketLabels = Array.from({
    length: Math.ceil((MAX - MIN) / BUCKET_SIZE),
  }).map((_, index) => MIN + index * BUCKET_SIZE);

  return (
    <div className="wrapper">
      <div className="status" role="status">
        {status === 'loading'
          ? 'Loading…'
          : status === 'error'
            ? 'Unable to load birth-year data.'
            : ''}
      </div>
      <div className="chart">
        <div className="chart__y-axis">
          <div className="chart__y-axis__items">
            {Array.from({
              length: maxYAxisValue / Y_AXIS_SCALE,
            }).map((_, index) => (
              <div key={index} className="chart__y-axis__item">
                {(index + 1) * Y_AXIS_SCALE}
              </div>
            ))}
          </div>
          <div className="chart__y-axis__zero">0</div>
        </div>
        <div className="chart__main">
          <div className="chart__main__bars">
            {bucketLabels.map((bucket) => (
              <div
                key={bucket}
                className="chart__main__bars__item"
                style={{
                  height: `${
                    ((bucketFrequency[bucket] ?? 0) / maxYAxisValue) * 100
                  }%`,
                }}
              />
            ))}
          </div>
          <div className="chart__x-axis">
            {bucketLabels.map((bucket) => (
              <div className="chart__x-axis__item" key={bucket}>
                {bucket}
              </div>
            ))}
          </div>
        </div>
      </div>
      <button disabled={status === 'loading'} onClick={fetchData}>
        Refresh
      </button>
    </div>
  );
}
33