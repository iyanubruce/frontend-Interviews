# Immer

**Difficulty:** Hard

## Description

[Immer](https://immerjs.github.io/immer/) is a popular library for immutable state updates. It is especially common in reducers, state containers, undo/redo flows, and editor-like UIs where state is deeply nested and changes often.

The main problem Immer solves is that manual immutable updates become noisy very quickly. If you update a deeply nested field with object spreads, you often end up rewriting every parent object by hand. That is verbose, easy to get wrong, and makes structural sharing harder to reason about.

Immer's core promise is much simpler:

- Write your update in a mutation-like style.
- Still get a new immutable result.
- Reuse untouched branches by reference.

In this question, implement a simplified `produce(baseState, recipe)` for plain objects so you can focus on that core idea.

The draft should behave as follows:

- The `recipe` function receives a mutable-looking `draft`.
- Reads should come from the original object until something is changed.
- The first write on a branch should create a shallow copy of that branch.
- Untouched branches should be reused by reference.

For this first version:

- `baseState` is always a plain object at the root.
- Nested values are JSON-like primitives or other plain objects.
- Arrays are out of scope in this first question.
- `recipe` only mutates the draft and does not return a replacement value.
- Inputs are guaranteed valid.

## Examples

```js
const state = {
  session: {
    user: {
      name: 'Alice',
      role: 'admin',
    },
    meta: {
      saved: false,
    },
  },
  theme: {
    mode: 'dark',
  },
};

const next = produce(state, (draft) => {
  draft.session.user.name = 'Bob';
});

next;
// {
//   session: {
//     user: {
//       name: 'Bob',
//       role: 'admin',
//     },
//     meta: {
//       saved: false,
//     },
//   },
//   theme: {
//     mode: 'dark',
//   },
// }

next !== state; // true
next.session !== state.session; // true
next.session.user !== state.session.user; // true
next.session.meta === state.session.meta; // true
next.theme === state.theme; // true
```

```js
const state = {
  session: {
    user: {
      name: 'Alice',
    },
  },
};

const next = produce(state, (draft) => {
  draft.session.user.active = true;
});

next;
// {
//   session: {
//     user: {
//       name: 'Alice',
//       active: true,
//     },
//   },
// }
```

## Arguments

`produce(baseState, recipe)` accepts the following arguments:

| Argument | Type | Description |
| --- | --- | --- |
| `baseState` | `Object` | The plain object to draft from. |
| `recipe` | `(draft) => void` | A function that can read and write the draft. |

## Returns

Returns a new object with the draft changes applied.

If the recipe performs no writes, return the original `baseState` reference.

## Notes

- Do not mutate `baseState`.
- Create shallow copies lazily, only when a branch is first written to.
- Reuse untouched branches by reference.
- You do not need arrays, `delete`, replacement return values, symbols, cycles, or special objects in this question.

## Follow-up

Implement [Immer II](/questions/javascript/immer-ii) to add arrays, `delete`, and explicit replacement return values.

## Files

| File | Contents |
| --- | --- |
| `immer.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
