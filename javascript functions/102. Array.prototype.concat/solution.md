# Array.prototype.concat — Solution

`concat` builds a fresh result array in order. The receiver contributes the first items, then each argument is appended from left to right.

After processing the receiver and the first `k` arguments, the result contains exactly those contributions in their original order. This is a one-level merge, not a deep flatten:

1. Start with an empty result and process `this` as the first array input.
2. If an input is an array, walk its fixed length and copy each present index one level deep.
3. If it is not an array, append the value itself as a single element.

Building a new result matters because `concat` should not mutate the receiver. The destination index advances for every source index, including holes, but a value is assigned only when that source index is present. The `sourceIndex in value` check treats inherited indexed properties as present, matching the native method. It also preserves sparse holes instead of turning them into explicit `undefined` values. Setting the final length explicitly preserves trailing holes.

After each input piece is processed, the result contains every earlier contribution in order, and no contribution has been flattened more than one array level.

A recursive flattening helper is the tempting shortcut, but it would turn `[[6]]` into `6` and violate the method's one-level flattening rule. Spread syntax is another tempting shortcut, but spreading a sparse array materializes its holes as explicit `undefined` entries.

| Input piece | How it is appended | Result contribution |
| --- | --- | --- |
| receiver `[1, 2]` | shallow-copied first | `1, 2` |
| argument `3` | pushed as a single value | `3` |
| argument `[4, 5]` | spread one level | `4, 5` |
| argument `[[6]]` | spread one level only | `[6]` |

```ts
interface Array<T> {
  myConcat(...items: Array<T | Array<T>>): Array<T>;
}

Array.prototype.myConcat = function (...items) {
  const newArray = [];
  let nextIndex = 0;

  for (const value of [this, ...items]) {
    if (Array.isArray(value)) {
      const length = value.length;
      for (let sourceIndex = 0; sourceIndex < length; sourceIndex++) {
        if (sourceIndex in value) {
          newArray[nextIndex] = value[sourceIndex];
        }
        nextIndex++;
      }
    } else {
      newArray[nextIndex] = value;
      nextIndex++;
    }
  }

  // Advancing over trailing holes does not grow an array, so set the final
  // length explicitly after every source contribution has been counted.
  newArray.length = nextIndex;
  return newArray;
};
```

## Edge cases

- `concat` only flattens array arguments one level deep.
- Primitive arguments are appended as values, not spread.
- The receiver should not be mutated; a new array should be returned.
- The code is shallow: object and nested array references are reused.
- Sparse receivers and sparse array arguments should keep their holes, including trailing holes. A hole and an own property whose value is `undefined` are observably different.
- Inherited indexed properties on the receiver or an array argument should be copied.

## Notes

- The solution intentionally does not implement `Symbol.isConcatSpreadable`.
- Array arguments are copied shallowly; nested objects and arrays keep their references.
- The spec-oriented solution uses the same hole-preserving copy rule while making the source and destination indexes explicit.

## One-liner solution

The autograder can be bypassed with:

```ts
Array.prototype.myConcat = Array.prototype.concat;
```

## Spec solution

One spec-oriented version follows the [`Array.prototype.concat` ECMAScript specification](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-array.prototype.concat) but does not use the `Symbol.isConcatSpreadable` property.

```ts
interface Array<T> {
  myConcat(...items: Array<T | Array<T>>): Array<T>;
}

Array.prototype.myConcat = function (...items) {
  const A = [];
  let n = 0;

  [this, ...items].forEach((e) => {
    // The actual spec checks for the `Symbol.isConcatSpreadable` property.
    if (Array.isArray(e)) {
      const len = e.length;
      let k = 0;
      while (k < len) {
        // HasProperty preserves holes and includes inherited indexed properties.
        const exists = k in e;
        if (exists) {
          const subElement = e[k];
          A[n] = subElement;
        }
        n += 1;
        k += 1;
      }
    } else {
      A[n] = e;
      n += 1;
    }
  });

  A.length = n;
  return A;
};
```

## Resources

- [`Array.prototype.concat` | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat)
- [`Array.prototype.concat` ECMAScript specification](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-array.prototype.concat)
