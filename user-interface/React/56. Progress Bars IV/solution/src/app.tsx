import { useEffect, useRef, useState } from 'react';

function ProgressBar({ progress }: Readonly<{ progress: number }>) {
  return (
    <div
      aria-valuemax={100}
      aria-valuemin={0}
      aria-valuenow={Math.floor(progress)}
      className="bar"
      role="progressbar">
      <div
        className="bar-contents"
        style={{ transform: `scaleX(${progress / 100})` }}
      />
    </div>
  );
}

const INITIAL_PROGRESSION = [0];
const CONCURRENCY_LIMIT = 3;

export default function App() {
  const [progression, setProgression] = useState(INITIAL_PROGRESSION);
  const [isProgressing, setIsProgressing] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function startTimer() {
    if (timerRef.current != null) return;

    timerRef.current = window.setInterval(() => {
      setProgression((currProgression) => {
        // Find the bars which aren't full.
        const nonFullBars = currProgression
          .map((value, index) => ({ value, index }))
          .filter(({ value }) => value < 100);
        // All bars are full, none to increment.
        if (nonFullBars.length === 0) {
          return currProgression;
        }

        // Get the first LIMIT non-full bars and increment them.
        const barsToIncrement = nonFullBars.slice(0, CONCURRENCY_LIMIT);
        const newProgression = currProgression.slice();
        for (const { index } of barsToIncrement) {
          newProgression[index] += 0.5;
        }
        return newProgression;
      });
    }, 10);
  }

  function stopTimer() {
    if (timerRef.current != null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  function start() {
    setIsProgressing(true);
    if (progression.some((value) => value < 100)) {
      startTimer();
    }
  }

  function pause() {
    setIsProgressing(false);
    stopTimer();
  }

  function appendBar() {
    setProgression((currProgression) => currProgression.concat(0));
    if (isProgressing) {
      startTimer();
    }
  }

  function reset() {
    pause();
    setProgression(INITIAL_PROGRESSION);
  }

  useEffect(() => {
    if (
      progression.every((value) => value >= 100) &&
      timerRef.current != null
    ) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, [progression]);

  useEffect(() => {
    return () => {
      if (timerRef.current != null) {
        window.clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <div className="wrapper">
      <div className="buttons">
        <button
          onClick={() => {
            appendBar();
          }}>
          Add
        </button>
        <button
          onClick={() => {
            isProgressing ? pause() : start();
          }}>
          {isProgressing ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={() => {
            reset();
          }}>
          Reset
        </button>
      </div>
      <div className="bars">
        {progression.map((progress, index) => (
          <ProgressBar key={index} progress={progress} />
        ))}
      </div>
      <pre>{JSON.stringify({ isProgressing, progression }, null, 2)}</pre>
    </div>
  );
}
