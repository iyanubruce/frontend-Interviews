# Array.prototype.square — Solution

`Array.prototype.square()` is a specialized `map()` for numbers: it reads each value from the array the method was called on and returns a new array where every value has been multiplied by itself. The method lives on the prototype, so receiver handling is just as important as the multiplication.

The important detail is the receiver. When the method is called as `arr.square()`, `this` is `arr`, so indexed access works exactly like it does in any other array loop.

The method must be defined with a normal function expression, not an arrow function, because the receiver is supplied by the method call.

For every index that has already been visited, `results[i]` should be the square of `this[i]`. That gives the method three pieces:

1. Read `this.length` so the result can have the same length.
2. Allocate a fresh array with `new Array(length)`.
3. Loop through the original array once and write `this[i] * this[i]` into the matching result index.

Using `new Array(length)` makes the non-mutating behavior explicit. The original array is only read from; all squared values are written into the new result array.

That is the interview argument for the manual loop: it shows that `square()` mirrors `map()`'s shape without mutating `this`, while still relying on method-call `this` rather than an explicit array parameter.

For `[-4, 10].square()`, the loop writes:

| Index | Source value | Result write |
| --- | --- | --- |
| `0` | `-4` | `16` |
| `1` | `10` | `100` |

```ts
interface Array<T> {
  square(): Array<number>;
}

Array.prototype.square = function () {
  const length = this.length;
  const results = new Array(length);

  for (let i = 0; i < length; i++) {
    results[i] = this[i] * this[i];
  }

  return results;
};
```

A shorter version can delegate the iteration and new-array creation to `Array.prototype.map()`.

That alternative is useful because it shows the same behavior as a specialization of `map`: one output value for each input value, with order preserved.

```ts
declare global {
  interface Array<T> {
    square(): Array<number>;
  }
}

Array.prototype.square = function (this: Array<number>): Array<number> {
  return this.map((el: number) => el * el);
};

export {};
```

## Common pitfalls

- **Mutating the original array:** This method should behave like `map()`, not like an in-place update. Assigning back into `this[i]` would make the returned values look correct but would fail the non-mutating requirement.
- **Losing the receiver:** `square()` needs access to the array instance through `this`. Define the prototype method with a normal function so `this` is provided by the method call.

## Notes

- Empty arrays return a new empty array.
- Negative numbers still work because squaring happens element by element.
- The original array is not modified.
- The prompt assumes the array only contains numbers.
- The prompt assumes the array is not sparse, e.g. `[1, 2, , 4]`.
