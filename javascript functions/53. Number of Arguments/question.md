# Number of Arguments

**Difficulty:** Easy

## Description

Implement a function `numberOfArguments` that returns the number of arguments it was called with. Note that this value is the actual number of arguments, which can be more or less than the defined parameter count (which is determined by `Function.prototype.length`).

P.S. There's no practical use for this function. However, knowing how to determine the number of arguments is useful for questions that require writing variadic functions like [Classnames](/questions/javascript/classnames) and [Curry II](/questions/javascript/curry-ii).

```js
numberOfArguments(); // 0
numberOfArguments(1); // 1
numberOfArguments(2, 3); // 2
numberOfArguments('a', 'b', 'c'); // 3
```

## Files

| File | Contents |
| --- | --- |
| `number-of-arguments.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
