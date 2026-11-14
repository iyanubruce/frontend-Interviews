# MobX

**Difficulty:** Hard

## Description

[MobX](https://mobx.js.org/README.html) is a state management library built around automatic dependency tracking.

In this question, implement a simplified MobX-style engine with just two APIs:

- `observable(object)` to create a tracked object
- `autorun(effect)` to run a function and rerun it whenever one of the properties it used changes

This interview-scoped version is intentionally limited:

- Only plain objects are in scope.
- Only top-level property reads and writes need to be tracked.
- Reactions run synchronously.
- Arrays, nested observables, decorators, `computed`, and actions are out of scope for this part.

## Examples

```js
const state = observable({ count: 0 });
const values = [];

const dispose = autorun(() => {
  values.push(state.count);
});

state.count = 1;
state.count = 2;

dispose();

values; // [0, 1, 2]
```

Only properties that were actually read during the latest run should be tracked.

```js
const state = observable({
  showCount: true,
  count: 1,
  other: 10,
});

const values = [];

autorun(() => {
  values.push(state.showCount ? state.count : state.other);
});

state.count = 2;
state.showCount = false;
state.count = 3;
state.other = 11;

values; // [1, 2, 10, 11]
```

After the reaction switches to `other`, later writes to `count` should no longer rerun it.

## API

### `observable(object)`

Creates and returns a reactive version of `object`.

Whenever a property is read while an `autorun` effect is executing, that effect should become subscribed to that property.

Whenever a property is assigned a different value, subscribed effects should rerun synchronously.

### `autorun(effect)`

Runs `effect` immediately, tracks which observable properties it reads, and reruns it whenever any of those properties changes.

Returns a dispose function. After disposal, the effect should stop reacting to future updates.

## Notes

- Setting a property to the same value should not rerun reactions.
- Dependency tracking should be recalculated on every rerun so conditional reads can change over time.
- The dispose function should be safe to call more than once.
- You do not need `computed`, `reaction`, nested batching, property deletion, or MobX's full production semantics.

## Follow-up

Implement [MobX II](/questions/javascript/mobx-ii) to add lazy `computed()` values.

## Files

| File | Contents |
| --- | --- |
| `mobx.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
