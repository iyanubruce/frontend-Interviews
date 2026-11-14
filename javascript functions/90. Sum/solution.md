# Sum — Solution

The task is representing a running total with closures. Each call either adds one more number to the chain or ends the chain by calling with no argument.

## Solution

The recommended solution stores the accumulated sum in the closure of the returned function.

- The first call seeds the running total.
- Each later call with a number returns another `sum` function whose closure holds the updated total.
- A call with no argument terminates the chain and returns the current total.

That makes the API recursive, but the frame is simple: every non-terminal call produces the same kind of function, just with a different closed-over total.

To detect the end of the chain, check specifically for `undefined`. Using loose equality would accidentally treat `null` as "no argument".

The reusable-partial behavior comes from immutability of the closed-over total: `sum(2)` keeps returning functions that start from `2`, while `sum(2)(3)` creates a separate chain starting from `5`.

For `sum(1)(2)(-3)()`, each non-terminal call returns a new function with a new closed-over total:

| Call | Argument | Closed-over total for returned function | Return type |
| --- | --- | --- | --- |
| `sum(1)` | `1` | `1` | function |
| `(2)` | `2` | `3` | function |
| `(-3)` | `-3` | `0` | function |
| `()` | `undefined` | `0` | number |

```ts
type SumResult = (value?: number) => number | SumResult;

export default function sum(numberA: number): SumResult {
  return function (numberB) {
    // Each call closes over the running total; omitting the next value ends the chain.
    return numberB === undefined ? numberA : sum(numberA + numberB);
  };
}
```

### Alternative approach: One-liner using arrow functions

Using arrow functions, the same closure-based idea can be written in one line.

```ts
type SumResult = (value?: number) => number | SumResult;

// The recursive call carries the accumulated total forward until chaining stops.
const sum =
  (a: number): SumResult =>
  (b) =>
    b !== undefined ? sum(a + b) : a;
export default sum;
```

## Edge cases

Intermediate results should be reusable for separate evaluations.

```ts
const addTwo = sum(2);
addTwo(3)(); // 5
addTwo(4)(); // 6
addTwo(3)(4)(); // 9
```

## Techniques

- Closures
- First-class functions
- `null` vs `undefined`

## Notes

- Calling `sum()` at the start without any arguments is not tested. The recommended behavior is to throw an `Error`.
- Do not use `==` to check for presence of an argument because `null == undefined` is `true`.
