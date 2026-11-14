# Immer — Solution

The task combines two opposite-looking ideas:

- The recipe should feel mutable.
- The final result should still be immutable.

Without Immer, updating nested state often means writing long chains of object spreads by hand. That works, but it quickly becomes noisy and distracts from the actual change.

The job of `produce()` is to hide that boilerplate. The caller writes:

```ts
draft.session.user.name = 'Bob';
```

Under the hood, the implementation still needs to:

- Keep the original object unchanged
- Create new objects only for the touched path
- Reuse every untouched branch by reference

## Why Proxy?

If the recipe received the original object directly, any assignment would mutate the real input.

If everything were deep-cloned up front, the approach would be simpler, but it would lose the structural sharing benefit that makes Immer useful.

`Proxy` provides a useful middle ground. It lets the recipe read and write through a draft object, while the implementation stays in control of what actually happens behind the scenes.

## Draft state shape

Each drafted object has its own state record.

That draft state stores:

1. `base`: the original object for this node.
2. `copy`: a shallow copy, created only after the first write.
3. `modified`: whether this node has been changed.
4. `parent`: a link to the parent draft state so change markers can bubble upward.
5. `drafts`: a child-draft cache so reading the same nested object twice returns the same proxy.

With that in place, the flow becomes:

1. Create one draft state object per proxied node.
2. Lazily proxy nested plain objects in the `get` trap.
3. On the first `set` for a node, create its shallow copy and mark that node as modified.
4. Bubble that change up to the parent so the whole ancestor chain knows it must produce a new result.
5. Finalize the root by returning untouched nodes as-is and recursively finalizing changed copies.

## Step-by-step example

Suppose the recipe does this:

```ts
draft.session.user.name = 'Bob';
```

Here is what happens conceptually:

1. Reading `draft.session` creates a proxy for the original `session` object.
2. Reading `.user` creates another proxy for the original `user` object.
3. Writing `.name = 'Bob'` marks the `user` node as changed and creates a shallow copy of `user`.
4. That change bubbles up, so `session` also gets marked changed and receives a shallow copy.
5. During finalization:  `theme` was never touched, so the original `theme` reference is reused. `session.meta` was never touched, so that is reused too. only the `user` object and its ancestors become new objects.

That is exactly the intended structural sharing behavior.

The reference changes can be summarized like this:

| Branch | Was it on the written path? | Final reference |
| --- | --- | --- |
| root object | yes | new object |
| `session` | yes | new object |
| `session.user` | yes | new object |
| `session.meta` | no | reused from base |
| `theme` | no | reused from base |

```ts
type DraftRecord = Record<PropertyKey, unknown>;

interface DraftState {
  base: DraftRecord;
  copy?: DraftRecord;
  modified: boolean;
  parent?: DraftState;
  key?: PropertyKey;
  drafts: Map<PropertyKey, DraftState>;
  proxy: DraftRecord;
}

const stateByProxy = new WeakMap<object, DraftState>();

function isPlainObject(value: unknown): value is DraftRecord {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function shallowCopy(value: DraftRecord): DraftRecord {
  return { ...value };
}

function getCurrentSource(state: DraftState): DraftRecord {
  return state.copy ?? state.base;
}

function prepareCopy(state: DraftState): void {
  if (!state.copy) {
    state.copy = shallowCopy(state.base);
  }
}

function markChanged(state: DraftState): void {
  if (!state.modified) {
    // The first write clones this node and recursively ensures every ancestor
    // owns a copy too.
    state.modified = true;
    prepareCopy(state);

    if (state.parent) {
      markChanged(state.parent);
    }
  }

  if (state.parent) {
    // Keep the parent's copy pointing at this proxy so later deep writes still
    // flow through proxy traps instead of a stale plain object.
    state.parent.copy![state.key!] = state.proxy;
  }
}

function createDraftState(
  base: DraftRecord,
  parent?: DraftState,
  key?: PropertyKey,
): DraftState {
  const state = {} as DraftState;

  state.base = base;
  state.copy = undefined;
  state.modified = false;
  state.parent = parent;
  state.key = key;
  state.drafts = new Map();

  state.proxy = new Proxy({} as DraftRecord, {
    get(_target, prop) {
      const source = getCurrentSource(state);
      const value = source[prop];

      if (
        typeof value === 'object' &&
        value !== null &&
        stateByProxy.has(value)
      ) {
        return value;
      }

      if (!isPlainObject(value)) {
        return value;
      }

      const cached = state.drafts.get(prop);
      if (cached && cached.base === value) {
        return cached.proxy;
      }

      const child = createDraftState(value, state, prop);
      state.drafts.set(prop, child);

      if (state.modified) {
        state.copy![prop] = child.proxy;
      }

      return child.proxy;
    },

    set(_target, prop, value) {
      markChanged(state);
      state.copy![prop] = value;
      return true;
    },

    deleteProperty() {
      throw new TypeError(
        'Deleting properties is not supported in this version',
      );
    },

    has(_target, prop) {
      return prop in getCurrentSource(state);
    },

    ownKeys() {
      return Reflect.ownKeys(getCurrentSource(state));
    },

    getOwnPropertyDescriptor(_target, prop) {
      const descriptor = Object.getOwnPropertyDescriptor(
        getCurrentSource(state),
        prop,
      );

      if (!descriptor) {
        return undefined;
      }

      return {
        ...descriptor,
        configurable: true,
      };
    },
  });

  stateByProxy.set(state.proxy, state);
  return state;
}

function finalizeValue(value: unknown): unknown {
  if (typeof value !== 'object' || value === null) {
    return value;
  }

  const state = stateByProxy.get(value);
  return state ? finalizeState(state) : value;
}

function finalizeState(state: DraftState): DraftRecord {
  // Unmodified subtrees can be reused by reference during finalization.
  if (!state.modified) {
    return state.base;
  }

  const result = state.copy as DraftRecord;

  for (const key of Reflect.ownKeys(result)) {
    result[key] = finalizeValue(result[key]);
  }

  return result;
}

export default function produce<T extends Record<string, unknown>>(
  baseState: T,
  recipe: (draft: T) => void,
): T {
  const root = createDraftState(baseState as DraftRecord);
  recipe(root.proxy as T);
  return finalizeState(root) as T;
}
```

## Finalization

Finalization is the last important step.

For each draft state:

- If it was never modified, return `base`.
- If it was modified, walk through its shallow `copy` and finalize any nested draft proxies stored inside it.

The `WeakMap` from proxy to draft state is what lets finalization recognize draft proxies. Plain values and ordinary objects that were never proxied can be returned as-is, while draft proxies are replaced by either their original `base` or finalized `copy`.

This is why unchanged recipes can return the original root reference, while changed recipes produce a fresh object graph only along the touched path.

## Common pitfalls

- Mutating the original object directly instead of writing through the draft proxy.
- Deep-cloning the whole input up front, which loses the structural-sharing behavior being tested.
- Forgetting to bubble `modified` up through parent states. If an ancestor is not marked, finalization can incorrectly reuse an old branch.
- Returning draft proxies from finalization instead of converting them back to plain objects.
- Creating a new child proxy on every read. Reusing child drafts keeps repeated reads stable and ensures later writes hit the same draft state.

## Notes

- Read-only recipes should return the original root reference.
- Updating a deep leaf should only clone the ancestor chain that leads to that leaf.
- Adding a new property to an existing nested object should work the same way as replacing an existing property.
- The original input object should stay unchanged.
- The proxy also implements basic object-read traps such as `has`, `ownKeys`, and `getOwnPropertyDescriptor`, so recipes can use patterns like `'key' in draft` and object spreading.
- This part only drafts plain objects. Arrays, `delete`, and explicit recipe return values are handled in [Immer II](/questions/javascript/immer-ii).
- `Map`, `Set`, `Date`, class instances, freezing, patches, and descriptor preservation are outside the scope of this implementation.

## Techniques

- Proxy
- Copy-on-write
- Structural sharing
- Immutable updates
