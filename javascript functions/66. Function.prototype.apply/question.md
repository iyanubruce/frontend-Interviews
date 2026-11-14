# Function.prototype.apply

**Difficulty:** Easy

## Description

> The `Function.prototype.apply()` method calls the specified function with a given `this` value, and `arguments` provided as an array (or an array-like object).

*Source: [Function.prototype.apply() - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Function/apply)*

Implement your own `Function.prototype.apply` without calling the native `apply` method. To avoid overwriting the actual `Function.prototype.apply`, implement the function as `Function.prototype.myApply`.

## Examples

```js
function multiplyAge(multiplier = 1) {
  return this.age * multiplier;
}

const mary = {
  age: 21,
};

const john = {
  age: 42,
};

multiplyAge.myApply(mary); // 21
multiplyAge.myApply(john, [2]); // 84
```

## Files

| File | Contents |
| --- | --- |
| `function-apply.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
