# Flatten — Solution

This is a common JavaScript interview question because it tests a small but transferable recursive condition: every item is either already a leaf value to keep, or it is another array whose leaves should be appended in the same left-to-right order.

## Clarification questions

1. What type of data does the array contain? Some approaches only apply to certain data types.
2. How many levels of nesting can this array have? If there are thousands of levels of nesting, recursion might not be a good idea given its large upfront memory footprint.
3. Should the function return a new array or mutate the existing array?
4. Can the implementation assume valid input, i.e. an array? Normally the answer is "yes", so defensive programming is unnecessary.
5. Does the environment where the code runs have ES6+ support? The environment determines which methods and native APIs are available.

## Solution

At every level, `flatten` repeats the same decision: if the next item is not an array, append it to the output; if it is an array, open it and process its items. The approaches below differ in where the still-unprocessed items live: an explicit working array, the call stack, or the input array itself.

For the recursive solution, the useful trace is:

| Input chunk | Decision | Contribution |
| --- | --- | --- |
| `1` | leaf | `[1]` |
| `[2, [3]]` | nested array | flatten it first |
| `2` | leaf inside nested array | `[2]` |
| `[3]` | nested array | `[3]` |
| combined | concatenate contributions | `[1, 2, 3]` |

### Approach 1: Iterative

First, decide how to check whether a value is an array. Use `Array.isArray` or `instanceof Array` for that check. There are some nuances between these two. For more detail, see [this article](https://jakearchibald.com/2017/arrays-symbols-realms/) by Jake Archibald.

Then, avoid mutating the original input array. Make a copy of the input array and return a new array with all the items extracted from it.

This solution loops through the array with a `while` loop, takes out one item at a time, and checks whether that item is an array. If it is not an array, put it into the `res` array. If it is an array, use the spread operator `...` to get all the items out of it and put them back into the array.

```ts
type ArrayValue<T> = T | Array<ArrayValue<T>>;

export default function flatten<T>(value: Array<ArrayValue<T>>): Array<T> {
  const res: Array<T> = [];
  // Work on a copy so the queue-style unshift/shift logic does not mutate the input.
  const copy = value.slice();

  while (copy.length) {
    const item = copy.shift()!;
    if (Array.isArray(item)) {
      // Put nested items back at the front so their order is preserved.
      copy.unshift(...item);
    } else {
      res.push(item as T);
    }
  }

  return res;
}
```

### Approach 2: Iteration using `Array.prototype.some`

A more concise approach, compared to the previous one, is to use `Array.prototype.some`.

```ts
type ArrayValue<T> = T | Array<ArrayValue<T>>;

export default function flatten<T>(value: Array<ArrayValue<T>>): Array<T> {
  // Flatten one level at a time until no nested arrays remain.
  while (value.some(Array.isArray)) {
    value = value.flatMap((item) => (Array.isArray(item) ? item : [item]));
  }

  return value as Array<T>;
}
```

### Approach 3: Recursion using `Array.prototype.reduce`

A recursive approach fits well here given the nested nature of this question, and it will simplify the code a lot.

```ts
type ArrayValue<T> = T | Array<ArrayValue<T>>;

export default function flatten<T>(value: Array<ArrayValue<T>>): Array<T> {
  return value.reduce<Array<T>>(
    // Recurse only for nested items, then concatenate the flattened chunk.
    (acc, curr) =>
      acc.concat(Array.isArray(curr) ? flatten(curr) : (curr as T)),
    [],
  );
}
```

Although a recursive approach always has the risk of overflowing the call stack, as of this writing, in Chrome, the maximum practical recursive depth is around 10 thousand calls, and in Firefox, it is 50 thousand, so this should not be a problem in practice. However, when the cost of recursion becomes a concern, a [generator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator) can lazily extract the flattened items from the array. That solution appears later.

### Approach 4: Flatten the array in-place

All solutions so far return a new flattened array without mutating the original input array. Again, this is normally the desired behavior.

However, the interviewer might ask for an in-place solution that doesn't allocate extra memory. That is, a solution with a constant `O(1)` space complexity.

In this case, the implementation needs array methods that *mutate*. There are 9 methods in total that mutate arrays: `pop`, `push`, `reverse`, `shift`, `sort`, `splice`, `unshift`, `copyWithin`, and `fill`.

Here is one possible solution that uses `splice` to mutate the input array:

```ts
type ArrayValue<T> = T | Array<ArrayValue<T>>;

export default function flatten<T>(value: Array<ArrayValue<T>>): Array<T> {
  for (let i = 0; i < value.length; ) {
    const item = value[i];
    if (Array.isArray(item)) {
      // Stay on the same index because splicing may reveal another nested array there.
      value.splice(i, 1, ...item);
    } else {
      i++;
    }
  }

  return value as Array<T>;
}
```

### Approach 5: Recursive approach using `flatMap`

The `flatMap` method returns a new array formed by applying a given callback function to each element of the array, and then flattening the result by one level. By calling it recursively, the entire array can be flattened until it is only one level deep.

```ts
type ArrayValue<T> = T | Array<ArrayValue<T>>;

export default function flatten<T>(value: Array<ArrayValue<T>>): Array<T> {
  // flatMap removes one level, so the recursive call handles arbitrarily deep nesting.
  return value.flatMap((item): T | Array<T> =>
    Array.isArray(item) ? flatten(item) : (item as T),
  );
}
```

---

## Bonus solutions

The following solutions only work under certain circumstances, so they should not be used during interviews.

### Bonus approach 1: Generator

As discussed earlier, if the array has thousands of levels of nesting, a recursive approach might cause a stack overflow. Generators can yield array items individually. Because generators are lazy, this would not have as large an upfront cost compared to the recursive approach.

This, however, results in a different function signature and is not supported by the test cases.

```ts
type ArrayValue<T> = T | Array<ArrayValue<T>>;

export default function* flatten<T>(
  value: Array<ArrayValue<T>>,
): Generator<T, void, unknown> {
  for (const item of value) {
    if (Array.isArray(item)) {
      // Yield from the nested generator so values stream out lazily.
      yield* flatten(item);
    } else {
      yield item as T;
    }
  }
}
```

### Bonus approach 2: Regular expressions and `JSON.stringify`

Here is a solution that might be considered unorthodox: encode the array into a JSON string via `JSON.stringify`, remove brackets using the regex `/(\[|\])/g`, and decode it back to an array using `JSON.parse`. Because all the brackets are stripped off with the regex, the result is an array with only one level of depth.

```ts
type ArrayValue<T> = T | Array<ArrayValue<T>>;

export default function flatten<T>(value: Array<ArrayValue<T>>): Array<T> {
  // This only works for JSON-serializable values because it strips brackets from the serialized form.
  return JSON.parse('[' + JSON.stringify(value).replace(/(\[|\])/g, '') + ']');
}
```

### Bonus approach 3: `toString` when the array contains only numbers

Recall the data-types clarification question. If the array contains only numbers, here is a very simple solution:

```ts
function flattenOnlyNumbers(array) {
  return array
    .toString()
    .split(',')
    .map((numStr) => Number(numStr));
}
```

Note that this only applies when the array contains only numbers, and this usage of `toString` might be thought of as "obscure".

## One-liner solution with `Array.prototype.flat`

JavaScript includes a [`flat` array method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat). It is usually off limits during interviews, but it is still useful to know that a native flatten function exists.

```ts
export default function flatten(arr) {
  return arr.flat(Infinity);
}
```

## Common pitfalls

- Decide whether the solution should mutate the input before choosing an approach. Most interview answers should return a new array.
- Recursive approaches can overflow the call stack on extremely deep nesting.
- JSON/string and `toString()` shortcuts only work for narrow data shapes and can lose types or values.

## Notes

- `Array.isArray()` is the safest ordinary check for array values across realms.
- The recursive and iterative approaches preserve the left-to-right order of leaf values.
- The bonus approaches are included as reference material and should not replace the general-purpose implementation in interviews.
