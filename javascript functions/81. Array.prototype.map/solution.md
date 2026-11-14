# Array.prototype.map — Solution

The core job is to walk the receiver array, preserve holes, and call the callback with the same argument shape as native `Array.prototype.map`.

## Solution

For `map`, preserve the same index range and transform only existing values. The output has the same length and the same holes as the input, but each existing element is replaced by the callback result.

The recommended starting point is a plain indexed loop because it makes the native behavior explicit.

- Read from `this`, because `myMap` is defined on `Array.prototype`.
- Allocate the result array up front so sparse input arrays stay sparse in the output.
- For each present index, call the callback with `(value, index, array)` and bind `thisArg` as the callback's `this`.

After checking index `k`, the output should have the same presence or absence of indices up to `k`, with existing values replaced by callback results.

Using `k in this` mirrors the native method's `HasProperty` check. True holes should be skipped, not treated as `undefined` values that still trigger the callback, while inherited indexed properties should still be visited.

For a sparse receiver, the loop should distinguish an explicit `undefined` value from a missing index:

| Index | Receiver has index? | Callback called? | Output slot |
| --- | --- | --- | --- |
| `0` in `[1, , undefined]` | yes | yes, with `1` | callback result |
| `1` in `[1, , undefined]` | no | no | remains a hole |
| `2` in `[1, , undefined]` | yes | yes, with `undefined` | callback result |

That is why the code uses an indexed loop plus `index in array` instead of `for...of`, which would not preserve the native sparse-array behavior as directly.

```ts
interface Array<T> {
  myMap<U>(
    callbackFn: (value: T, index: number, array: Array<T>) => U,
    thisArg?: any,
  ): Array<U>;
}

Array.prototype.myMap = function (callbackFn, thisArg) {
  const len = this.length;
  // Pre-size the result so sparse inputs stay sparse in the output as well.
  const array = new Array(len);

  for (let k = 0; k < len; k++) {
    // True holes are skipped, while inherited indexed properties are visited,
    // matching the native method's HasProperty check.
    if (k in this) {
      array[k] = callbackFn.call(thisArg, this[k], k, this);
    }
  }

  return array;
};
```

## Edge cases

- The map callback receives the element, index, and original array.
- When `thisArg` is specified, the callback should run with that receiver.
- Sparse arrays (e.g. `[1, 2, , 4]`). The empty values should be ignored while traversing the array.
- Inherited indexed properties are present and should invoke the callback.

## Notes

Mutating the array inside the callback is possible, but it makes the behavior harder to follow. The provided solution follows the important native `map()` rules:

- The range of elements processed by `map` is set before the first callback is called.
- Elements appended to the array after the call to `map` begins will not be visited by the callback.
- If existing elements are changed, the callback sees the value at the time that index is visited.
- Elements deleted before they are visited are skipped.
- The callback receives the original receiver as its third argument, so code inside the callback can inspect the same array being traversed.

The `thisArg` has no effect when the callback is an arrow function because arrow functions do not have their own `this`.

## One-liner solution

For completeness, the built-in method could be assigned directly:

```ts
Array.prototype.myMap = Array.prototype.map;
```

That works for the exercise, but it does not teach the underlying behavior.

## Spec solution

A specification-oriented version based on [`Array.prototype.map`](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-array.prototype.map) looks like this.

```ts
Array.prototype.myMap = function (callbackFn, thisArg) {
  if (
    typeof callbackFn !== 'function' ||
    !callbackFn.call ||
    !callbackFn.apply
  ) {
    throw new TypeError(`${callbackFn} is not a function`);
  }

  const len = this.length;
  const A = new Array(len);
  let k = 0;

  while (k < len) {
    // HasProperty skips true holes but includes inherited indexed properties.
    const kPresent = k in this;
    if (kPresent) {
      const kValue = this[k];
      const mappedValue = callbackFn.call(thisArg, kValue, k, this);
      A[k] = mappedValue;
    }
    k = k + 1;
  }

  return A;
};
```

## Resources

- [`Array.prototype.map` | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)
- [`Array.prototype.map` ECMAScript specification](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-array.prototype.map)
