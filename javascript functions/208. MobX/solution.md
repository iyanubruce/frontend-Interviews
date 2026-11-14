# MobX — Solution

At first glance, MobX can feel a little "magical": a function reads `state.count`, and later that function reruns automatically when `count` changes.

The reactive core is actually small. Only three pieces are needed:

- a way to remember **which functions care about which properties**
- a way to know **which function is running right now**
- a way to **clean up old subscriptions** before tracking fresh ones

## Solution

The implementation uses three concepts:

- An **observable property** is just a property with a subscriber list.
- A **reaction** is the function passed to `autorun()`.
- A **dependency** means "this reaction read this property during its latest run".

Subscriptions should describe the latest completed run of a reaction, not every property it has ever read.

From there, the approach falls into three steps.

### 1. Store subscribers per property

Each property needs its own bucket of subscribers. The data structure can be:

- one `WeakMap` from object -> property map
- one inner `Map` from property key -> dependency bucket
- one `Set` inside each bucket containing the reactions that should rerun

So conceptually, if a reaction reads `state.count`, the dependency graph looks like:

```ts
count -> Set([thatReaction])
```

### 2. Track reads while a reaction is running

When `autorun(effect)` runs, temporarily mark that reaction as the "active" one.

Now every `get` on the observable proxy can do this:

1. Look up the dependency bucket for that property.
2. Check whether there is an active reaction.
3. If there is, subscribe that reaction to the property.

That is why a `Proxy` is such a good fit here: property reads go through the `get` trap automatically, so dependency tracking feels transparent to the caller.

### 3. Rerun subscribed reactions on writes

When a property is assigned a new value:

- Compare it to the old value.
- If nothing changed, do nothing.
- Otherwise notify every reaction subscribed to that property.

Each subscribed reaction reruns synchronously.

The solution snapshots and queues reactions before running them. That keeps mutation of subscriber sets during cleanup from corrupting the current notification pass and dedupes repeated invalidations in the same cascade.

### Why dependency cleanup matters

Dependencies must be recalculated when conditional reads change.

Consider:

```ts
autorun(() => {
  console.log(state.showCount ? state.count : state.other);
});
```

On the first run, the reaction might depend on `showCount` and `count`. Later, if `showCount` becomes `false`, the reaction should now depend on `showCount` and `other`.

If the old dependencies were never removed, then later writes to `count` would still rerun the reaction even though the latest run no longer uses `count`.

That is why a reaction should:

1. Remove itself from all old dependency buckets.
2. Clear its dependency list.
3. Run again and collect the new set of dependencies from scratch.

In the `showCount ? count : other` example, the dependency set changes like this:

| Latest run sees | Subscribed properties |
| --- | --- |
| `showCount === true` | `showCount`, `count` |
| `showCount === false` | `showCount`, `other` |

After cleanup, a later write to `count` should not rerun the reaction in the second state.

Reaction.run()

cleanupReaction(reaction)

Push reactionStack

effect reads observable properties

trackAtom adds subscribers

Property set notifies subscribers

```ts
interface Subscriber {
  onDependencyChanged(): void;
}

class Atom {
  subscribers = new Set<Subscriber>();
}

class Reaction implements Subscriber {
  effect: () => void;
  dependencies = new Set<Atom>();
  disposed = false;
  isScheduled = false;

  constructor(effect: () => void) {
    this.effect = effect;
  }

  run(): void {
    if (this.disposed) {
      return;
    }

    this.isScheduled = false;
    // Re-track from scratch so dependencies from the previous run do not stay subscribed.
    cleanupReaction(this);
    reactionStack.push(this);

    try {
      this.effect();
    } finally {
      reactionStack.pop();
    }
  }

  onDependencyChanged(): void {
    scheduleReaction(this);
  }

  dispose(): void {
    if (this.disposed) {
      return;
    }

    this.disposed = true;
    pendingReactions.delete(this);
    cleanupReaction(this);
  }
}

const targetAtoms = new WeakMap<object, Map<PropertyKey, Atom>>();
const reactionStack: Array<Reaction> = [];
const pendingReactions = new Set<Reaction>();
let batchDepth = 0;
let isFlushing = false;

function getAtom(target: object, key: PropertyKey): Atom {
  let atomsForTarget = targetAtoms.get(target);
  if (atomsForTarget == null) {
    atomsForTarget = new Map();
    targetAtoms.set(target, atomsForTarget);
  }

  let atom = atomsForTarget.get(key);
  if (atom == null) {
    atom = new Atom();
    atomsForTarget.set(key, atom);
  }

  return atom;
}

function getActiveReaction(): Reaction | undefined {
  return reactionStack[reactionStack.length - 1];
}

function trackAtom(atom: Atom): void {
  const reaction = getActiveReaction();
  if (
    reaction == null ||
    reaction.disposed ||
    reaction.dependencies.has(atom)
  ) {
    return;
  }

  reaction.dependencies.add(atom);
  atom.subscribers.add(reaction);
}

function cleanupReaction(reaction: Reaction): void {
  reaction.dependencies.forEach((atom) => {
    atom.subscribers.delete(reaction);
  });
  reaction.dependencies.clear();
}

function startBatch(): void {
  batchDepth += 1;
}

function endBatch(): void {
  batchDepth -= 1;

  if (batchDepth === 0) {
    flushReactions();
  }
}

function notifySubscribers(subscribers: Set<Subscriber>): void {
  startBatch();

  try {
    Array.from(subscribers).forEach((subscriber) => {
      subscriber.onDependencyChanged();
    });
  } finally {
    endBatch();
  }
}

function scheduleReaction(reaction: Reaction): void {
  if (reaction.disposed || reaction.isScheduled) {
    return;
  }

  // The Set-backed queue dedupes repeated invalidations before the next flush.
  reaction.isScheduled = true;
  pendingReactions.add(reaction);

  if (batchDepth === 0) {
    flushReactions();
  }
}

function flushReactions(): void {
  if (isFlushing) {
    return;
  }

  isFlushing = true;

  try {
    while (pendingReactions.size > 0) {
      const reactions = Array.from(pendingReactions);
      pendingReactions.clear();

      reactions.forEach((reaction) => {
        reaction.run();
      });
    }
  } finally {
    isFlushing = false;
  }
}

export function observable<T extends object>(object: T): T {
  return new Proxy(object, {
    get(target, key, receiver) {
      trackAtom(getAtom(target, key));
      return Reflect.get(target, key, receiver);
    },

    set(target, key, value, receiver) {
      const oldValue = Reflect.get(target, key);
      if (Object.is(oldValue, value)) {
        return true;
      }

      const didSet = Reflect.set(target, key, value, receiver);
      if (didSet) {
        notifySubscribers(getAtom(target, key).subscribers);
      }

      return didSet;
    },
  });
}

export function autorun(effect: () => void): () => void {
  const reaction = new Reaction(effect);
  reaction.run();

  return () => {
    reaction.dispose();
  };
}
```

## Edge cases

- `autorun()` should execute immediately the first time.
- Writing the same value should not trigger another run.
- Disposing should unsubscribe the reaction and be safe to call more than once.
- If an effect stops reading a property on later runs, that old property should stop triggering the effect.

## Techniques

- Proxies
- Dependency tracking
- Subscription cleanup
- Working with `Map`, `Set`, and `WeakMap`

## Notes

- This first part focuses only on observable properties and eager reactions.
- The small reaction queue in the solution helps keep notifications predictable and avoids duplicate reruns during the same update cascade.
- Lazy derived values are introduced in [MobX II](/questions/javascript/mobx-ii).
- `Object.is`-style equality means assigning the same value is a no-op, while real changes rerun only the reactions that read the changed property.

## Resources

- [MobX documentation](https://mobx.js.org/README.html)
