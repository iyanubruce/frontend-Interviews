# Array.prototype.reduce — Solution

Matching native `reduce` behavior requires two details:

- The reducer callback receives `currentIndex` and `array` as its third and fourth arguments.
- If no initial value is supplied, the element at index `0` becomes the initial accumulator and iteration starts at index `1`.

## Solution

`myReduce` is a single pass that threads an accumulator through the array. The accumulator is the running answer: after visiting index `k`, it contains the reduction of every visited element up to `k`.

The accumulator always represents visited elements in order, never future elements. The reducer's return value is the only way the accumulator changes.

There are two phases, and keeping them separate prevents most bugs:

1. Establish the starting accumulator and first index from the presence of `initialValue`.
2. Walk the fixed index range, calling the reducer only for indexes that currently exist.

The main setup step is deciding what the accumulator and first visited index should be:

- If `initialValue` is provided, use it as the accumulator and start at index `0`.
- Otherwise, scan forward for the first present index, use that element as the accumulator, and continue from the next index. This skip-and-seed step matters for sparse arrays such as `[, , 1, 2, 3]`, where the first present index is `2`, not `0`.
- If no present index exists (empty array or all holes) and `initialValue` is not provided, throw a `TypeError`.

Use `arguments.length <= 1` rather than `initialValue === undefined` to detect a missing initial value. The two are not equivalent: passing `undefined` explicitly is a valid initial value and the native `Array.prototype.reduce` distinguishes the two by argument count.

Once that starting state is fixed, iterate through the array and call `callbackFn(accumulator, currentValue, currentIndex, array)`. Each callback result becomes the next accumulator.

The implementation checks `index in this` before invoking the callback. This mirrors the specification's `HasProperty` operation: true holes are skipped, while indexed properties inherited through the prototype chain are still visited. `Object.hasOwn(...)` would incorrectly skip those inherited values.

For `[1, 2, 3].myReduce((acc, value) => acc + value, 4)`, the accumulator trace is:

| Index | Current value | Accumulator before callback | Callback result |
| --- | --- | --- | --- |
| `0` | `1` | `4` | `5` |
| `1` | `2` | `5` | `7` |
| `2` | `3` | `7` | `10` |

Without an initial value, the first row would be skipped because index `0` seeds the accumulator, so iteration starts at index `1`.

```ts
interface Array<T> {
  myReduce<U>(
    callbackFn: (
      previousValue: U,
      currentValue: T,
      currentIndex: number,
      array: T[],
    ) => U,
    initialValue?: U,
  ): U;
}

Array.prototype.myReduce = function (callbackFn, initialValue) {
  // Check arguments.length so explicit `undefined` initial values are honored,
  // matching how the native `Array.prototype.reduce` distinguishes the two.
  const noInitialValue = arguments.length <= 1;
  const len = this.length;

  let k = 0;
  let acc: any;

  if (noInitialValue) {
    // Seed from the first present index, including inherited indexed properties.
    while (k < len && !(k in this)) k++;
    if (k >= len) {
      throw new TypeError('Reduce of empty array with no initial value');
    }
    acc = this[k];
    k++;
  } else {
    acc = initialValue;
  }

  for (; k < len; k++) {
    // Missing indexes do not contribute, but inherited indexes do.
    if (k in this) {
      acc = callbackFn(acc, this[k], k, this);
    }
  }

  return acc;
};
```

## Edge cases

- Empty array, with and without the `initialValue` argument.
- Single-value array, with and without the `initialValue` argument.
- Sparse arrays with interior holes, e.g. `[1, 2, , 4]`. Empty slots are skipped while traversing.
- Sparse arrays with leading holes and no `initialValue`, e.g. `[, , 1, 2, 3]`. The seed comes from the first present index, not index `0`.
- All-hole arrays with no `initialValue`, e.g. `[, , ,]`. These should throw a `TypeError` just like `[]`.
- Indexed properties inherited through the array's prototype. Native `reduce` treats them as present and visits them.
- `undefined` passed explicitly as `initialValue`. It must be treated as a provided seed, distinct from omitting the argument.

## Common pitfalls

- Forgetting to pass the `index` and `array` to the reducer callback.
- Using an own-property check for array indexes. The native method also visits inherited indexed properties, so use `index in array`.
- Using `initialValue === undefined` to detect a missing argument. Use `arguments.length <= 1` instead so explicit `undefined` is honored.

## Notes

Mutating the array in the reduce callback is a bad idea and can cause unintended consequences. It is a positive signal to mention that mutation of the array within the callback is possible. The provided solution follows the TC39 specification for array mutation scenarios:

- The range of elements processed by `reduce` is set before the first callback is called.
- Elements appended to the array after the call to `reduce` begins will not be visited by the callback.
- If existing elements of the array are changed, their value as passed to the callback will be the value at the time `reduce` visits them.
- Elements that are deleted after the call to `reduce` begins and before being visited are not visited.

The spec solution below mirrors the TC39 algorithm directly, including the validity checks on `callbackFn` that the compact implementation skips for brevity.

In an interview, call out that the starting state is the hard part; the loop after that is just "call reducer, replace accumulator".

## One-liner solution

The autograder can be bypassed with:

```ts
Array.prototype.myReduce = Array.prototype.reduce;
```

## Spec solution

One spec-aligned version based on [`Array.prototype.reduce`](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-array.prototype.reduce) looks like this.

```ts
Array.prototype.myReduce = function (callbackFn, initialValue) {
  const len = this.length;
  const noInitialValue = arguments.length <= 1;

  if (
    typeof callbackFn !== 'function' ||
    !callbackFn.call ||
    !callbackFn.apply
  ) {
    throw new TypeError(`${callbackFn} is not a function`);
  }

  if (len === 0 && noInitialValue) {
    throw new TypeError('Reduce of empty array with no initial value');
  }

  let k = 0;
  let accumulator = undefined;

  if (!noInitialValue) {
    accumulator = initialValue;
  } else {
    let kPresent = false;
    while (!kPresent && k < len) {
      // HasProperty includes inherited indexed properties and skips true holes.
      kPresent = k in this;
      if (kPresent) {
        accumulator = this[k];
      }
      k = k + 1;
    }

    if (!kPresent) {
      throw new TypeError('Reduce of empty array with no initial value');
    }
  }

  while (k < len) {
    const kPresent = k in this;
    if (kPresent) {
      const kValue = this[k];
      accumulator = callbackFn(accumulator, kValue, k, this);
    }
    k = k + 1;
  }

  return accumulator;
};
```

## Resources

- [`Array.prototype.reduce` | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)
- [`Array.prototype.reduce` ECMAScript specification](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-array.prototype.reduce)
