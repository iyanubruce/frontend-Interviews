# useEffectOnce

**Difficulty:** Easy

## Description

Implement a `useEffectOnce` hook that runs an effect once for the mounted component lifecycle, using the same setup and cleanup behavior as `useEffect`.

React Strict Mode can intentionally run an extra setup and cleanup cycle in development. Do not suppress that cycle; preserving React's cleanup semantics is more important than hiding development-only diagnostics.

```js
export default function Component() {
  useEffectOnce(() => {
    console.log('Running effect once on mount');

    return () => {
      console.log('Running cleanup of effect on unmount');
    };
  });

  return null;
}
```

## Arguments

- `effect`: The function that will be executed once. This function has the same parameters and behavior as the first argument of `useEffect`

## Returns

Nothing, just like `useEffect`.

## Files

| File | Contents |
| --- | --- |
| `use-effect-once.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
