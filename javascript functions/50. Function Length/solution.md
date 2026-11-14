# Function Length — Solution

Here the important part is knowing which metadata JavaScript already exposes on function objects. The key interview distinction is declared arity versus call-site arity: `fn.length` describes the function signature, while `arguments.length` describes one particular invocation.

## Solution

Every function has a `length` property. The important rule is what that property measures:

- It counts parameters before the first default value.
- It excludes the rest parameter.
- It is based on the function signature, not on how many arguments are passed at call time.

Once that behavior is clear, the code is just a direct property read.

This helper is observational only. It should not invoke `fn`, wrap it, parse its source, or count arguments from a call frame; it returns the static arity metadata the engine already attached to the function object.

| Function shape | `length` | Why |
| --- | --- | --- |
| `function foo(a, b) {}` | `2` | Two required parameters are declared. |
| `function foo(a, b = 1) {}` | `1` | Counting stops before the first default. |
| `function foo(...args) {}` | `0` | Rest parameters are excluded. |

```ts
export default function functionLength(fn: Function): number {
  // JavaScript already records a function's declared arity on `length`.
  return fn.length;
}
```

## Edge cases

The `length` property excludes the rest parameter and only includes parameters before the first one with a default value.

```ts
function foo(a, b = 2) {}
foo.length; // 1

function bar(a = 1, b = 2) {}
bar.length; // 0

function baz(...args) {}
baz.length; // 0
```

Those default/rest examples document JavaScript's native behavior. The submitted tests focus on ordinary functions and arrow functions because transpilation can rewrite default parameters before the browser runner observes `.length`.

## Notes

This helper intentionally does not parse source text, inspect runtime arguments, or call the function. It reads the static metadata already maintained by the JavaScript engine.

If an interviewer brings up `arguments.length`, answer by separating the two timelines: `fn.length` is known when the function object is created, while `arguments.length` only exists inside a particular call.

## Resources

- [Function: length | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/length)
