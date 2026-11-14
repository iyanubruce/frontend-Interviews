# Classnames — Solution

## Clarification questions

These clarifications define which input shapes the class-name flattener should accept and which ones it should ignore.

> Can there be duplicated classes in the input? Should the output contain duplicated classes?

Yes, there can be. In this case, the output will contain duplicate classes. However, this case is not tested.

> What if a class was added and then later turned off? E.g. `classNames('foo', { foo: false })`?

In the library implementations, the final result will be `'foo'`. However, this case is not tested.

## Solution

The subtle part is the recursive nature of the function. Separate the solution into two parts:

1. Handling each data type.
2. Recursing for array types.

Use a `classes` data structure to collect all classes for the lifetime of the function and make them available to recursive calls. The solution uses an `Array` for the collection, but a `Set` also works.

To recursively process each argument and collect the classes, a few approaches come to mind:

1. **Pure recursive function**: Recursive calls do not depend on external values nor modify the arguments.
2. **Inner recursive helper that modifies an external value**: The collection is defined at the top level of the function. Inner recursive functions modify the external top-level collection by adding to that collection.
3. **Inner recursive helper that modifies the argument**: The collection is defined at the top level of the function, passed as an argument into recursive calls, and recursive calls add to the argument.

Handle each data type as follows:

- **Falsy values**: Ignore.
- **String**: Add it to the `classes` collection.
- **Number**: Add it to the `classes` collection.
- **Array**: Recursively invoke the `classNames` function or inner recursive function.
- **Object**: Loop through the key/value pairs and add keys with truthy values to the `classes` collection.

The data-type order is part of the property. Check falsy values before anything else, then arrays before generic objects, because arrays also report `typeof value === 'object'`. Object values are conditions; object keys are the class names.

For the nested example `classNames('a', ['b', { c: true, d: false }])`, the recursion behaves like this:

| Value being processed | Contribution |
| --- | --- |
| `'a'` | `a` |
| `['b', { c: true, d: false }]` | recurse into each item |
| `'b'` | `b` |
| `{ c: true, d: false }` | `c` only |
| final join | `a b c` |

### Approach 1: Pure recursive function

In this approach, the `classNames` function calls itself and its return value is a string that can be composed by parent recursive calls.

```ts
export type ClassValue =
  | ClassArray
  | ClassDictionary
  | string
  | number
  | null
  | boolean
  | undefined;
export type ClassDictionary = Record<string, any>;
export type ClassArray = Array<ClassValue>;

export default function classNames(...args: Array<ClassValue>): string {
  // Each recursive call returns one space-joined segment; the parent call keeps
  // those segments in the original left-to-right order.
  const classes: Array<string> = [];

  args.forEach((arg) => {
    // Ignore falsey values.
    if (!arg) {
      return;
    }

    const argType = typeof arg;

    // Handle string and numbers.
    if (argType === 'string' || argType === 'number') {
      classes.push(String(arg));
      return;
    }

    // Arrays recurse before objects because `typeof []` is `'object'`.
    if (Array.isArray(arg)) {
      classes.push(classNames(...arg));
      return;
    }

    // Only own truthy keys contribute classes.
    if (argType === 'object') {
      const objArg = arg as ClassDictionary;
      for (const key in objArg) {
        if (Object.hasOwn(objArg, key) && objArg[key]) {
          classes.push(key);
        }
      }

      return;
    }
  });

  return classes.join(' ');
}
```

### Approach 2: Inner recursive helper that modifies an external value

In this approach, an inner `classNamesImpl` helper function is defined and it accesses the top-level `classes` collection within recursive calls. The helper function does not return anything; its main purpose is to process each argument and add them to `classes`.

```ts
export type ClassValue =
  | ClassArray
  | ClassDictionary
  | string
  | number
  | null
  | boolean
  | undefined;
export type ClassDictionary = Record<string, any>;
export type ClassArray = Array<ClassValue>;

export default function classNames(...args: Array<ClassValue>): string {
  const classes: Array<string> = [];

  // Every recursive call writes into the same outer collection.
  function classNamesImpl(...args: Array<ClassValue>) {
    args.forEach((arg) => {
      // Ignore falsey values.
      if (!arg) {
        return;
      }

      const argType = typeof arg;

      // Handle string and numbers.
      if (argType === 'string' || argType === 'number') {
        classes.push(String(arg));
        return;
      }

      // Arrays recurse before objects because `typeof []` is `'object'`.
      if (Array.isArray(arg)) {
        for (const cls of arg) {
          classNamesImpl(cls);
        }

        return;
      }

      // Only own truthy keys contribute classes.
      if (argType === 'object') {
        const objArg = arg as ClassDictionary;
        for (const key in objArg) {
          if (Object.hasOwn(objArg, key) && objArg[key]) {
            classes.push(key);
          }
        }

        return;
      }
    });
  }

  classNamesImpl(...args);

  return classes.join(' ');
}
```

### Approach 3: Inner recursive helper that modifies the argument

In this approach, an inner `classNamesImpl` helper function is defined and it accepts a `classesArr` argument. The `classesArr` is modified and passed along within recursive calls and all `classNamesImpl` calls reference the same instance of `classesArr`. The helper function does not return anything; its main purpose is to process each argument and add them to the `classesArr` argument.

```ts
export type ClassValue =
  | ClassArray
  | ClassDictionary
  | string
  | number
  | null
  | boolean
  | undefined;
export type ClassDictionary = Record<string, any>;
export type ClassArray = Array<ClassValue>;

export default function classNames(...args: Array<ClassValue>): string {
  const classes: Array<string> = [];

  // Thread the same accumulator array through every recursive call.
  function classNamesImpl(
    classesArr: Array<string>,
    ...args: Array<ClassValue>
  ) {
    args.forEach((arg) => {
      // Ignore falsey values.
      if (!arg) {
        return;
      }

      const argType = typeof arg;

      // Handle string and numbers.
      if (argType === 'string' || argType === 'number') {
        classesArr.push(String(arg));
        return;
      }

      // Arrays recurse before objects because `typeof []` is `'object'`.
      if (Array.isArray(arg)) {
        for (const cls of arg) {
          classNamesImpl(classesArr, cls);
        }

        return;
      }

      // Only own truthy keys contribute classes.
      if (argType === 'object') {
        const objArg = arg as ClassDictionary;
        for (const key in objArg) {
          if (Object.hasOwn(objArg, key) && objArg[key]) {
            classesArr.push(key);
          }
        }

        return;
      }
    });
  }

  classNamesImpl(classes, ...args);

  return classes.join(' ');
}
```

## Edge cases

- Falsy values are ignored before type handling, so `null`, `undefined`, `false`, `''`, and `0` do not add classes.
- Non-zero numbers are converted to class tokens.
- Arrays must be handled before objects because `typeof []` is `'object'`.
- Object keys are included only when their own value is truthy; prototype keys are skipped.
- Duplicate class names are preserved in this version. De-duplication is a follow-up, not part of the base rule.

## Follow-up: De-duplicating classes

The provided solution does not handle de-duplicating classes, which would be a nice optimization. Without de-duplication, `classNames('foo', 'foo')` returns `'foo foo'`, which is unnecessary as far as the browser result is concerned.

In some cases, de-duplication can also affect the result, e.g. in the case of `classNames('foo', { foo: false })`, `{ foo: false }` appears later in the arguments, so the user probably did not mean for `'foo'` to appear in the final result.

This can be handled by using `Set` to collect the classes from the start, adding or removing classes where necessary.

De-duplicating classes is usually out of scope for interviews, but it is a possible follow-up question. The de-duplicating functionality is covered in [Classnames II](/questions/javascript/classnames-ii).

## Techniques

- Familiarity with JavaScript value types and how to check for them
- Recursion
- Converting from `Array`s to `Set`s and vice versa (for the unique classes follow-up)
- Handling of variadic arguments

## Notes

- `typeof []` gives `'object'`, so arrays need to be handled before objects.
- These scenarios are usually out of scope, but they are worth mentioning:  **Stack overflow**: Possibility of stack overflow. This applies to any recursive solution **Circular references**: Possibility of circular references for arrays and objects. This applies to any input which has arbitrary depth
- The base question preserves duplicates. Removing a class because a later object has `{ className: false }` belongs to a different conflict-resolution model.

## Library implementation

For reference, this is how the [`classnames` npm package](https://github.com/JedWatson/classnames) is implemented:

```ts
export type ClassValue =
  | ClassArray
  | ClassDictionary
  | string
  | number
  | null
  | boolean
  | undefined;
export type ClassDictionary = Record<string, any>;
export type ClassArray = Array<ClassValue>;

const hasOwn = Object.prototype.hasOwnProperty;

export default function classNames(...args: Array<ClassValue>): string {
  const classes: Array<string> = [];

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (!arg) continue;

    const argType = typeof arg;

    if (argType === 'string' || argType === 'number') {
      classes.push(String(arg));
    } else if (Array.isArray(arg)) {
      if (arg.length) {
        const inner = classNames(...arg);
        if (inner) {
          classes.push(inner);
        }
      }
    } else if (argType === 'object') {
      if (arg.toString === Object.prototype.toString) {
        const objectArg = arg as ClassDictionary;

        for (const key in objectArg) {
          if (hasOwn.call(objectArg, key) && objectArg[key]) {
            classes.push(key);
          }
        }
      } else {
        classes.push(arg.toString());
      }
    }
  }

  return classes.join(' ');
}
```

## Resources

- [`classnames` library on GitHub](https://github.com/JedWatson/classnames)
- [`clsx` library on GitHub](https://github.com/lukeed/clsx): A newer version that serves as a faster and smaller drop-in replacement for `classnames`.
