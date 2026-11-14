# Cycle — Solution

`cycle()` has two separate pieces:

- The original `values` array captured by the returned function.
- One `index` that points to the next value to return.

Each call has two phases: read `values[index]`, then advance the cursor. Reading first matters because it makes the first call return the first argument passed to `cycle()`.

After reading the current value, advance `index` by one. Keep `index` within the array bounds, so wrap it with modulo arithmetic after incrementing:

```ts
index = (index + 1) % values.length;
```

When `index` reaches `values.length`, the modulo result becomes `0`, so the next call starts from the beginning again. This lets the returned function keep cycling forever with only one piece of mutable state.

For `cycle('on', 'off')`, the closure behaves like this:

| Call | Index read | Returned value | Next index |
| --- | --- | --- | --- |
| 1 | `0` | `"on"` | `1` |
| 2 | `1` | `"off"` | `0` |
| 3 | `0` | `"on"` | `1` |

For a single value, the same modulo rule still works: `(0 + 1) % 1` is `0`, so the cursor remains on the only entry forever.

```ts
export default function cycle<T>(...values: Array<T>): () => T {
  let index = 0;

  return () => {
    // Read the current entry before advancing so the first call returns `values[0]`.
    const currentValue = values[index];
    // Wrap back to the start after the last item.
    index = (index + 1) % values.length;
    return currentValue;
  };
}
```

An alternative shorter solution is to start `index` before the first item, then increment before returning the value:

```ts
export default function cycle<T>(...values: Array<T>): () => T {
  // Start before the first item so the pre-increment lands on index 0.
  let index = -1;

  return () => {
    index = (index + 1) % values.length;
    return values[index];
  };
}
```

## Common pitfalls

- **Advancing before reading:** If `index` starts at `0` and the function increments before reading, the first call returns the second value. Either read before advancing, as in the main solution, or initialize `index` to `-1` when using the pre-increment style.

### Forgetting to wrap the index

Without modulo arithmetic, `index` keeps growing past the end of the array and later calls return `undefined`. Keep the cursor in range after every call.

## Notes

- The question says `cycle()` takes one or more values. The function should not be called without any arguments.
- With one value, the same value is returned on every call.
- Each call to `cycle()` creates a separate closure with its own `index`.
- The closure stores the argument values in the rest-parameter array. It does not deep-clone object values passed into the cycle.

## Resources

- [JavaScript Code Challenges](https://jscodechallenges.vercel.app/challenges/functions#11-design-a-function-with-cycle-functionality-for-given-list-of-inputs-where-cycle-function-accepts-list-of-values-to-be-cycled-upon)
