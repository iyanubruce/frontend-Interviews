# useObject

**Difficulty:** Medium

## Description

Implement a `useObject` hook that manages JavaScript [`Object`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) state. A plain object, also known as a POJO (Plain Old JavaScript Object), is a key-value store initialized with [`{}`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer).

When the state setter is called with an object, it is merged with the existing object.

It is more convenient to use `useObject` instead of plain `useState` because with `useState`, you would always have to create a new object, mutate it, then set state to use the new object (or create a new object via object spread), which can be quite cumbersome.

## Examples

```js
export default function Component() {
  const [record, setRecord] = useObject({ a: 1, b: 2 });

  return (
    <div>
      <pre>{JSON.stringify(record, null, 2)}</pre>
      <button onClick={() => setRecord((prev) => ({ a: prev.a + 1 }))}>
        Increase a
      </button>
      <button onClick={() => setRecord((prev) => ({ b: prev.b + 1 }))}>
        Increase b
      </button>
      <button onClick={() => setRecord(() => ({ c: 3 }))}>Add c</button>
    </div>
  );
}
```

## Arguments

- `initialValue`: The initial value of the object

## Returns

The hook returns an array with two elements:

1. The current object state
2. An updater function that can update the object state

The updater function can receive either:

1. An object that will be merged with the current state object
2. An updater function that receives the current state object and returns an object that will be merged with the current state object

## Notes

- Updates should shallow-merge into the current object; they should not replace the object entirely.
- The updater-function form should derive its patch from the latest previous state.
- Only plain object patches are valid. If a direct patch or the value returned by an updater is an array, `null`, `Date`, or another non-plain object, throw an error with the message `Invalid new state`.

## Files

| File | Contents |
| --- | --- |
| `use-object.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
