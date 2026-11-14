import { useEffect, useRef, useState } from 'react';

// Fisher-Yates shuffle.
function shuffle<T>(array: Array<T>) {
  for (let i = 0; i < array.length; i++) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function generateMolePositions(molesAtOnce: number, totalCount: number) {
  // Generate an array containing values [0, totalCount].
  const indices = Array.from({ length: totalCount }).map((_, index) => index);
  shuffle(indices);
  // Take the first `totalCount` items
  // from the shuffled array.
  const shuffledIndices = indices.slice(0, molesAtOnce);

  return new Set(shuffledIndices);
}

function WhackAMole({
  rows = 3,
  cols = 3,
  roundDuration = 15,
  molesAtOnce = 1,
  molesAppearingInterval = 1500,
}) {
  const totalCount = rows * cols;

  const [{ visible, score }, setRoundState] = useState<{
    visible: Set<number>;
    score: number | null;
  }>(() => ({
    // Set of indices for currently visible moles.
    visible: new Set<number>(),
    // Current player score.
    score: null,
  }));
  // Whether the game is in progress.
  const [running, setRunning] = useState(false);
  // Time left for the current round.
  const [timeLeft, setTimeLeft] = useState(roundDuration);
  const timeLeftRef = useRef(roundDuration);
  const countdownTimerId = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    let timerId: ReturnType<typeof setInterval> | undefined;

    if (running) {
      // Generate moles at fixed intervals.
      timerId = setInterval(() => {
        setRoundState((currentRound) => ({
          ...currentRound,
          visible: generateMolePositions(molesAtOnce, totalCount),
        }));
      }, molesAppearingInterval);
    }

    return () => {
      clearInterval(timerId);
    };
  }, [running, molesAtOnce, molesAppearingInterval, totalCount]);

  function startGame() {
    clearInterval(countdownTimerId.current ?? undefined);

    // Reset variables to default values.
    setRunning(true);
    setTimeLeft(roundDuration);
    timeLeftRef.current = roundDuration;
    setRoundState({
      score: 0,
      visible: generateMolePositions(molesAtOnce, totalCount),
    });

    // Interval to decrement the timer to 0.
    countdownTimerId.current = setInterval(() => {
      const nextTimeLeft = Math.max(timeLeftRef.current - 1, 0);
      timeLeftRef.current = nextTimeLeft;
      setTimeLeft(nextTimeLeft);

      if (nextTimeLeft === 0) {
        clearInterval(countdownTimerId.current ?? undefined);
        countdownTimerId.current = null;
        setRunning(false);
        setRoundState((currentRound) => ({
          ...currentRound,
          visible: new Set<number>(),
        }));
      }
    }, 1000);
  }

  useEffect(() => {
    return () => {
      // Clear countdown timer on unmount if it's running.
      clearInterval(countdownTimerId.current ?? undefined);
    };
  }, []);

  function whackMole(index: number) {
    if (!running) {
      return;
    }

    setRoundState((currentRound) => {
      // Whacking on an empty cell, no-op.
      if (!currentRound.visible.has(index)) {
        return currentRound;
      }

      const newVisible = new Set(currentRound.visible);
      newVisible.delete(index);
      return {
        score: (currentRound.score ?? 0) + 1,
        visible: newVisible,
      };
    });
  }

  return (
    <div className="app">
      <div className="header">
        {score == null ? (
          <button className="start-button" type="button" onClick={startGame}>
            Start Game
          </button>
        ) : (
          <div className="round-information">
            <p aria-live="polite">Score: {score}</p>
            {!running && (
              <button
                className="start-button"
                type="button"
                onClick={startGame}>
                Play again
              </button>
            )}
            <p aria-live="polite">Time Left: {timeLeft}</p>
          </div>
        )}
      </div>
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
        }}>
        {Array(totalCount)
          .fill(null)
          .map((_, index) => {
            return (
              <button
                aria-label={
                  visible.has(index)
                    ? `Whack mole in hole ${index + 1}`
                    : `Empty hole ${index + 1}`
                }
                className="grid__cell"
                disabled={!running}
                key={index}
                type="button"
                onClick={() => whackMole(index)}>
                <img
                  src="https://www.greatfrontend.com/img/questions/whack-a-mole/mole-head.webp"
                  alt=""
                  className={[
                    'grid__cell-contents',
                    'mole-head',
                    visible.has(index) && 'mole-head--visible',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                />
                <img
                  src="https://www.greatfrontend.com/img/questions/whack-a-mole/mole-hill.webp"
                  alt=""
                  className="grid__cell-contents mole-hill"
                />
              </button>
            );
          })}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <WhackAMole
      rows={3}
      cols={3}
      roundDuration={15}
      molesAtOnce={1}
      molesAppearingInterval={1500}
    />
  );
}
