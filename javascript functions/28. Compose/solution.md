# Compose — Solution

The key rule for `compose(f, g, h)(x)` is right-to-left data flow: run `h` first, feed that result into `g`, then feed that result into `f`. The common mistake is writing a left-to-right `pipe` because the functions are listed in the order they appear. If no functions are provided, the returned function is the identity function.

## Solution

All three implementations create a new unary function that feeds the input through the provided functions from right to left. The `reduceRight` version expresses that order in one expression.

The returned function closes over the `fns` list, so composition is configured once and can be called many times with different inputs. It is a `compose`, not a `pipe`, because the last provided function is the first one executed.

Derive the `reduceRight` version from two decisions: the initial accumulator is the argument passed to the composed function, and each reducer step replaces that accumulator with the current function's return value. That keeps the helper unary and makes the no-function case return the original input unchanged.

### Approach 1: Using `reduceRight`

`compose(...fns)` returns a new function that accepts the initial input. Inside that returned function, `reduceRight` starts with the original input and applies the functions from the end of `fns` back to the start.

Each step receives the previous step's output, so the final accumulated value is exactly what function composition means: `f(g(h(x)))`.

Using the prompt example, `compose(subtract10, double, add1)(3)` runs:

| Step | Function | Input | Output |
| --- | --- | --- | --- |
| 1 | `add1` | `3` | `4` |
| 2 | `double` | `4` | `8` |
| 3 | `subtract10` | `8` | `-2` |

```ts
export default function compose(...fns: Array<Function>): Function {
  return function (x: any): Function {
    // `compose(f, g)(x)` should run `g` first, then feed its result into `f`.
    return fns.reduceRight((result, func) => func(result), x);
  };
}
```

### Approach 2: Using `for` loops

`reduceRight` can also be written as a `for` loop that traverses the array from the back.

```ts
export default function compose(...fns: Array<Function>): Function {
  return function (x: any) {
    let result = x;

    for (let i = fns.length - 1; i >= 0; i--) {
      // Walk backward so the last function receives the original input first.
      result = fns[i](result);
    }

    return result;
  };
}
```

### Approach 3: Recursion

A recursive solution is also possible. Note that it uses extra memory for the recursion stack and can even cause a stack overflow.

```ts
export default function compose(...fns: Array<Function>): Function {
  return function (x: any) {
    if (fns.length === 0) {
      return x;
    }

    function apply(...fns: Array<Function>): any {
      const [fn, ...rest] = fns;
      if (rest.length === 0) {
        return fn(x);
      }

      // Recurse to the end first, then unwind from right to left.
      return fn(apply(...rest));
    }

    return apply(...fns);
  };
}
```

## Edge cases

- If no functions are provided, the composed function should behave like the identity function and return its input unchanged.
- With a single function, composition should behave exactly like that function.
- The important behavior is right-to-left execution order.
- Each function is assumed to accept one value; multi-argument composition is outside this prompt.
- `reduceRight` naturally handles the identity case because the initial accumulator is the original input.
