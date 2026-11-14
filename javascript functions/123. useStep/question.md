# useStep

**Difficulty:** Medium

## Description

Implement a `useStep` hook that manages a step counter for a multi-step process.

The hook should provide utility methods to go to the next and previous steps, and allow the step counter to be reset. The step number is 1-indexed and goes up to at most `maxStep`.

## Examples

```js
export default function Component() {
  const { step, next, previous, reset, setStep, hasNext, hasPrevious } =
    useStep(3);

  return (
    <div>
      <p>Step {step}</p>
      <button onClick={previous} disabled={!hasPrevious}>
        Previous
      </button>
      <button onClick={next} disabled={!hasNext}>
        Next
      </button>
      <button onClick={reset}>Reset</button>
      <button onClick={() => setStep(3)}>Go to step 3</button>
    </div>
  );
}
```

## Arguments

- `maxStep: number`: The maximum step number, i.e., the last step

## Returns

The hook returns an object with the following properties and methods:

- `step`: The current step number. It is initialized to `1`
- `next: () => void`: A function that increments the step number
- `previous: () => void`: A function that decrements the step number
- `hasNext: boolean`: A boolean that indicates whether there is a next step
- `hasPrevious: boolean`: A boolean that indicates whether there is a previous step
- `reset: () => void`: A function that resets the step number to `1`
- `setStep`: A function that sets the step number to a specific step. This should accept both a `number` and an updater function `(currentStep: number) => number`, similar to what the setter function of `useState` accepts

## Notes

- Valid step values are integers from `1` to `maxStep`, inclusive.
- `next()` and `previous()` should clamp at the boundaries.
- `setStep()` should ignore values outside the valid range.
- `hasNext` and `hasPrevious` should be derived from the current step instead of stored separately.

## Files

| File | Contents |
| --- | --- |
| `use-step.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
