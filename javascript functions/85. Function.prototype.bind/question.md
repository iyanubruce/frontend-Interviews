# Function.prototype.bind

**Difficulty:** Easy

## Description

> The `Function.prototype.bind()` method creates a new function that, when called, has its `this` keyword set to the provided value, with a given sequence of arguments preceding any provided when the new function is called.

*Source: [Function.prototype.bind() - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Function/bind)*

Implement your own `Function.prototype.bind` without calling the native `bind` method. To avoid overwriting the actual `Function.prototype.bind`, implement the function as `Function.prototype.myBind`.

## Examples

```js
const john = {
  age: 42,
  getAge: function () {
    return this.age;
  },
};

const unboundGetAge = john.getAge;
console.log(unboundGetAge()); // undefined

const boundGetAge = john.getAge.myBind(john);
console.log(boundGetAge()); // 42
```

## Files

| File | Contents |
| --- | --- |
| `function-bind.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
