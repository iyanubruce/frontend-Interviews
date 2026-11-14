# Classnames II — Solution

This follow-up is less about recursion itself and more about precedence. Later inputs can turn a class on or off even if they appear several array levels deep, so use a recursive walker backed by one shared `Set`.

## Clarification questions

This follow-up needs explicit input rules because object keys, nested arrays, and falsy values affect the output string.

> If a class is turned off within a nested array, will it be turned off overall?

It depends on the position of the classes within the input, regardless of nested level. Classes that appear later will take precedence.

## Solution

Split the problem into two jobs:

1. Normalize each supported input type.
2. Process nested arrays in order while mutating one shared `Set`.

A `Set` is a good backing store because the final result must contain unique class names, and object entries may need to delete a class that was added earlier.

The recursive helper should update `classes` in declaration order:

- Falsy values: ignore them.
- Strings and numbers: add their string form.
- Functions: call them and add the returned class if it is truthy.
- Arrays: recurse into each item.
- Objects: add keys whose values are truthy and delete keys whose values are falsy.

Every nested call should update the same `classes` set. If each recursive call built its own result and merged it later, it would be harder to preserve the "later values win" behavior across nesting levels.

Trace for `classNames('foo', [{ foo: false }, 'bar', { foo: true }])`:

| Input piece | Set after processing |
| --- | --- |
| `'foo'` | `{'foo'}` |
| `{ foo: false }` | `{}` |
| `'bar'` | `{'bar'}` |
| `{ foo: true }` | `{'bar', 'foo'}` |

```ts
export type ClassValue =
  | ClassArray
  | ClassDictionary
  | Function
  | string
  | number
  | null
  | boolean
  | undefined;
export type ClassDictionary = Record<string, any>;
export type ClassArray = Array<ClassValue>;

export default function classNames(...args: Array<ClassValue>): string {
  // One shared Set lets deeper recursive calls add or remove classes while
  // preserving the global "later values win" ordering.
  const classes: Set<string> = new Set();

  function classNamesImpl(...args: Array<ClassValue>) {
    args.forEach((arg) => {
      // Ignore falsey values.
      if (!arg) {
        return;
      }

      const argType = typeof arg;

      // Handle string and numbers.
      if (argType === 'string' || argType === 'number') {
        classes.add(String(arg));
        return;
      }

      // Handle functions.
      if (argType === 'function') {
        const result = (arg as Function)();
        if (!result) {
          return;
        }

        classes.add(String(result));
      }

      // Arrays recurse before objects because `typeof []` is `'object'`.
      if (Array.isArray(arg)) {
        for (const cls of arg) {
          classNamesImpl(cls);
        }

        return;
      }

      // Objects can both enable and disable keys, so they must mutate the
      // shared Set directly instead of returning partial strings.
      if (argType === 'object') {
        const objArg = arg as ClassDictionary;
        for (const key in objArg) {
          if (Object.hasOwn(objArg, key)) {
            objArg[key] ? classes.add(key) : classes.delete(key);
          }
        }

        return;
      }
    });
  }

  classNamesImpl(args);

  return Array.from(classes).join(' ');
}
```

## Edge cases

- `typeof []` gives `'object'`, so arrays must be handled before plain objects.
- Function inputs are invoked and their truthy return values are treated like class names.
- Object values can turn off classes that were added earlier, including classes added from nested arrays.
- Deeply nested or circular input is usually out of scope for this interview version.

## Techniques

- Familiarity with JavaScript value types and how to check for them
- Recursion
- Conversion of `Set`s to `Array`s
- Handling of variadic arguments

## Notes

- A shared `Set` removes duplicates while preserving first insertion order for the classes that remain enabled.

## Resources

- [`classnames` library on GitHub](https://github.com/JedWatson/classnames)
- [`clsx` library on GitHub](https://github.com/lukeed/clsx): A newer version that serves as a faster and smaller drop-in replacement for `classnames`.
