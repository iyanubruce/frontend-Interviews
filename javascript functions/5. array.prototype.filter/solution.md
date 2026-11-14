# Array.prototype.filter — Solution

Here the important part is matching native `filter` behavior: iterate over the array-like `this`, skip holes, call the predicate with the right arguments and `thisArg`, and collect only truthy matches.

## Solution

Think of `filter` as a yes/no gate for each existing index in the original array range. When the predicate says yes, copy that value into a new dense result array; when it says no, leave it out.

Break the code into four important pieces:

1. Snapshot `this.length` before the loop so later mutations do not extend the visited range.
2. Check `k in this` before reading an index. This mirrors the native method's `HasProperty` check, which skips true holes but includes inherited indexed properties.
3. Call the predicate as `callbackFn.call(thisArg, value, index, this)` so the callback sees the correct `this`.
4. Push the element into `results` only when the predicate returns a truthy value.

Walk the original index range once, retaining each present value whose predicate result is truthy.

This is why a simple `for...of` loop is not enough for a faithful polyfill. It would not expose the numeric index in the same way, and it would make sparse-array holes harder to distinguish from present elements whose value is actually `undefined`.

For `[1, 2, , 4]` with `value % 2 === 0`, the visited indexes are:

| Index | Present? | Predicate result | Result |
| --- | --- | --- | --- |
| `0` | Yes | `false` | skipped |
| `1` | Yes | `true` | push `2` |
| `2` | No | not called | skipped hole |
| `3` | Yes | `true` | push `4` |

```ts
interface Array<T> {
  myFilter(
    callbackFn: (value: T, index: number, array: Array<T>) => boolean,
    thisArg?: any,
  ): Array<T>;
}

Array.prototype.myFilter = function (callbackFn, thisArg) {
  const len = this.length;
  const results = [];

  // Snapshot the original range so callback-side pushes do not extend the walk.
  for (let k = 0; k < len; k++) {
    // Native filter skips true holes but visits inherited indexed properties,
    // matching its HasProperty check.
    if (k in this) {
      const kValue = this[k];
      if (callbackFn.call(thisArg, kValue, k, this)) {
        results.push(kValue);
      }
    }
  }

  return results;
};
```

## Edge cases

- The filter callback receives the element, index, and original array.
- When `thisArg` is specified, the callback should run with that receiver.
- Sparse arrays, e.g. `[1, 2, , 4]`. The empty values should be ignored while traversing the array.
- Present elements whose value is `undefined` should still invoke the callback; only missing indexes are skipped.
- Inherited indexed properties are present and should invoke the callback.
- Appending items inside the callback should not extend the visited range because `len` is captured before the first callback runs.

## Notes

Mutating the array in the filter callback is possible, but it makes behavior harder to follow. The provided solution follows the native rules for mutation during iteration:

- The range of elements processed by `filter` is set before the first callback is called.
- Elements appended to the array after the call to `filter` begins will not be visited by the callback.
- If existing elements of the array are changed, their value as passed to the callback will be the value at the time `filter` visits them.
- Elements that are deleted after the call to `filter` begins and before being visited are not visited.

The `thisArg` has no effect if the callback is defined as an arrow function because arrow functions do not have their own `this` binding.

## One-liner solution

The autograder can be bypassed with:

```ts
Array.prototype.myFilter = Array.prototype.filter;
```

## Spec solution

The following version follows the [`Array.prototype.filter` ECMAScript specification](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-array.prototype.filter).

```ts
Array.prototype.myFilter = function (callbackFn, thisArg) {
  if (
    typeof callbackFn !== 'function' ||
    !callbackFn.call ||
    !callbackFn.apply
  ) {
    throw new TypeError(`${callbackFn} is not a function`);
  }

  const len = this.length;
  const A = [];
  let k = 0;
  let to = 0;

  while (k < len) {
    // HasProperty skips true holes but includes inherited indexed properties.
    const kPresent = k in this;
    if (kPresent) {
      const kValue = this[k];
      const selected = Boolean(callbackFn.call(thisArg, kValue, k, this));
      if (selected === true) {
        A[to] = kValue;
        to += 1;
      }
    }
    k += 1;
  }

  return A;
};
```

## Resources

- [`Array.prototype.filter` | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)
- [`Array.prototype.filter` ECMAScript specification](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-array.prototype.filter)
