# useStep — Solution

The public API is a small wizard-state controller: expose the current 1-indexed step, provide safe navigation helpers, and derive boundary booleans from that step. The hook should have one source of truth, not separate state for every returned field.

## Solution

`useStep(maxStep)` is one piece of state plus a few safe ways to update it. The state is the current, 1-indexed step. `step` must always stay between `1` and `maxStep`.

Build the API from that condition:

1. Store only `currentStep`; derive boundary booleans during render.
2. Clamp relative moves from `next()` and `previous()` because those helpers mean "go as far as possible in this direction."
3. Reject invalid explicit jumps in `setStep()` because the caller asked for a specific target.
4. Resolve functional `setStep` inputs inside React's functional updater so queued updates compose correctly.
5. Keep callbacks stable except where `maxStep` is needed to enforce the upper bound.

```ts
const [currentStep, setCurrentStep] = useState(1);
```

`next()` and `previous()` are navigation helpers, so they clamp at the nearest valid step. Calling `next()` on the last step should leave the state at `maxStep`, and calling `previous()` on the first step should leave it at `1`.

```ts
const next = useCallback(() => {
  setCurrentStep((step) => Math.min(step + 1, maxStep));
}, [maxStep]);

const previous = useCallback(() => {
  setCurrentStep((step) => Math.max(step - 1, 1));
}, []);
```

`setStep()` is the explicit setter API. It mirrors React's `setState` shape by accepting either a number or an updater function. The code uses the functional form of `setCurrentStep()` so updater functions compose from the latest step, even when React batches multiple updates together.

```ts
setCurrentStep((currentStep) => {
  const newStep = typeof step === 'function' ? step(currentStep) : step;
  if (newStep < 1 || newStep > maxStep) return currentStep;

  return newStep;
});
```

`hasNext` and `hasPrevious` are derived during render instead of stored in state. They are always a function of `currentStep` and `maxStep`.

```ts
hasNext: currentStep < maxStep,
hasPrevious: currentStep > 1,
```

With `maxStep = 5`, the helpers behave differently at the boundaries:

| Current step | Call | Next step | Why |
| --- | --- | --- | --- |
| `1` | `previous()` | `1` | clamps to the minimum |
| `4` | `next()` | `5` | increments within range |
| `5` | `next()` | `5` | clamps to the maximum |
| `1` | `setStep(6)` | `1` | rejects invalid explicit jump |
| `1` | `setStep((step) => step + 2)` | `3` | updater resolves from latest state |

```ts
import { Dispatch, SetStateAction, useCallback, useState } from 'react';

interface UseStepReturn {
  step: number;
  next: () => void;
  previous: () => void;
  reset: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
  setStep: Dispatch<SetStateAction<number>>;
}

export default function useStep(maxStep: number): UseStepReturn {
  const [currentStep, setCurrentStep] = useState(1);

  const setStep: UseStepReturn['setStep'] = useCallback(
    (step) => {
      setCurrentStep((currentStep) => {
        // Accept either a number or updater, but only commit steps inside the valid range.
        const newStep = typeof step === 'function' ? step(currentStep) : step;
        if (newStep < 1 || newStep > maxStep) return currentStep;

        return newStep;
      });
    },
    [maxStep],
  );

  const next: UseStepReturn['next'] = useCallback(() => {
    setCurrentStep((step) => Math.min(step + 1, maxStep));
  }, [maxStep]);

  const previous: UseStepReturn['previous'] = useCallback(() => {
    setCurrentStep((step) => Math.max(step - 1, 1));
  }, []);

  const reset: UseStepReturn['reset'] = useCallback(() => {
    setCurrentStep(1);
  }, []);

  return {
    step: currentStep,
    next,
    previous,
    hasNext: currentStep < maxStep,
    hasPrevious: currentStep > 1,
    setStep,
    reset,
  };
}
```

## Common pitfalls

- **Storing `hasNext` and `hasPrevious`:** These booleans do not need independent state. Storing them would create another source of truth that has to be updated every time `step` changes.
- **Forgetting functional updates:** `setStep((step) => step + 1)` should be based on the latest committed step. Use `setCurrentStep((currentStep) => ...)` internally so multiple queued updater functions compose correctly.
- **Mixing up clamping and rejecting:** `next()` and `previous()` clamp because they represent relative navigation. `setStep()` ignores invalid values because it is an explicit request to jump to a specific step.

## Notes

- The hook is 1-indexed. The valid range is `[1, maxStep]`.
- `reset()` always returns to step `1`.
- The hook assumes `maxStep` is the upper bound supplied by the caller. It does not add validation or error handling for invalid `maxStep` values.
- The explicit `setStep()` path rejects invalid jumps, while relative navigation helpers clamp; that difference is part of the public behavior.
