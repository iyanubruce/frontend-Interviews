# Number of Arguments — Solution

`arguments.length` reports how many arguments were actually passed at call time, regardless of how the function parameters are declared.

| Call | Declared parameters matter? | Argument count |
| --- | --- | --- |
| `numberOfArguments()` | no | `0` |
| `numberOfArguments(undefined)` | no | `1` |
| `numberOfArguments(...[1, 2, 3])` | no | `3` |

This is the same distinction interviewers use when discussing variadic utilities: the runtime argument list can be shorter or longer than the function's formal parameter list.

The value of an argument does not matter. `null`, `undefined`, `NaN`, arrays, objects, and spread values all count exactly once per position supplied by the caller.

### Approach 1: Using `arguments` object

The `arguments` object is an array-like object that is accessible inside functions and contains the values passed to that function. Hence, `arguments.length` determines the number of arguments passed.

```ts
export default function numberOfArguments(...args: Array<any>): number {
  // `arguments` reflects what was actually passed, regardless of the declared parameters.
  return arguments.length;
}
```

### Approach 2: Using rest parameters

The rest parameter syntax is a cleaner modern alternative. By using it as the whole parameter list, it captures all arguments passed to the function in a real array.

```ts
export default function numberOfArguments(...args: Array<any>): number {
  // When rest is the whole parameter list, its array length is the argument count.
  return args.length;
}
```

## Edge cases

Calling a function with `undefined` still counts as passing an argument. Default function parameters will be initialized with default values if no value or `undefined` is passed.

```ts
function foo(a = 1) {
  return a;
}

foo(undefined); // 1
foo(); // 1
```

## Notes

What happens for functions that have default parameters? The answer is that they behave exactly the same.

```ts
function foo(a = 1, b = 2) {
  return arguments.length;
}

foo(); // 0
foo(3); // 1
foo(undefined); // 1
```

## Resources

- [The arguments object | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/arguments)
- [Rest parameters | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters)
