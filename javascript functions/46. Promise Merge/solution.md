# Promise Merge — Solution

## Clarification questions

- What happens if there are overlapping properties on objects to be merged?  They can simply be overridden; a deep merge doesn't need to be performed.

This problem is both promise coordination and value merging. A solution that only focuses on the merge can accidentally observe the two promises serially; a solution that only coordinates promises can forget that unsupported resolved types must reject.

## Solution

The core challenge is coordinating two independent async results without accidentally serializing them. The starting point should make that property explicit: both promises run in parallel, each fulfillment is stored in its own slot, and the merge happens exactly once after both slots are filled.

### Approach 1: Manual coordination

The outer promise needs to handle two tasks:

1. Reject immediately if either input promise rejects.
2. Wait until both fulfill, then merge the two resolved values.

The coordination state is separate from the merge rules. `unresolved`, `p1Result`, and `p2Result` only answer "are both results ready"; `mergeResult()` answers "are these two values mergeable".

The code does that with an `unresolved` counter and two result slots. Each `.then()` handler stores its value and decrements the counter. When the counter reaches `0`, both results are ready and can be merged.

The merge step only supports matching pairs of numbers, strings, arrays, and plain objects. Any other combination rejects with `'Unsupported data types'`.

Example timeline when `p2` resolves first:

| Event | `p1Result` | `p2Result` | `unresolved` | Wrapper state |
| --- | --- | --- | --- | --- |
| start | empty | empty | `2` | pending |
| `p2` fulfills with `[4, 5]` | empty | `[4, 5]` | `1` | pending |
| `p1` fulfills with `[1, 2, 3]` | `[1, 2, 3]` | `[4, 5]` | `0` | resolve `[1, 2, 3, 4, 5]` |

If either promise rejects at any point, the wrapper rejects with that reason and never needs a merge decision.

```ts
export default function promiseMerge(
  p1: Promise<unknown>,
  p2: Promise<unknown>,
): Promise<unknown> {
  let unresolved = 2;
  let p1Result: unknown, p2Result: unknown;

  return new Promise((resolve, reject) => {
    // Wait for both promises to settle successfully before applying the merge rules.
    function then() {
      unresolved--;
      if (unresolved === 0) {
        resolve(mergeResult(p1Result, p2Result));
      }
    }

    p1.then((result) => {
      p1Result = result;
      then();
    }).catch(reject);
    p2.then((result) => {
      p2Result = result;
      then();
    }).catch(reject);
  });
}

function mergeResult(result1: unknown, result2: unknown): unknown {
  try {
    if (typeof result1 === 'number' && typeof result2 === 'number') {
      return result1 + result2;
    }

    if (typeof result1 === 'string' && typeof result2 === 'string') {
      return result1 + result2;
    }

    if (Array.isArray(result1) && Array.isArray(result2)) {
      return [...result1, ...result2];
    }

    if (isPlainObject(result1) && isPlainObject(result2)) {
      return { ...(result1 as Object), ...(result2 as Object) };
    }

    throw 'Unsupported data types';
  } catch {
    throw 'Unsupported data types';
  }
}

function isPlainObject(value: unknown): boolean {
  // For null and undefined.
  if (value == null) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === null || prototype === Object.prototype;
}
```

Notice that the logic to keep track of the resolved results can get repetitive, and it gets worse if the function supports more than two promises. Thankfully, there is a built-in helper for this coordination: `Promise.all()`.

### Approach 2: Using `Promise.all()`

This is the cleaner version when built-ins are allowed. `Promise.all()` already handles the "wait for both or reject on the first failure" part, so the code only needs to merge the resolved values.

```ts
export default function promiseMerge(
  p1: Promise<unknown>,
  p2: Promise<unknown>,
): Promise<unknown> {
  // Let `Promise.all()` coordinate both inputs, then reuse the same type-based merge rules.
  return Promise.all([p1, p2]).then(([result1, result2]) => {
    try {
      if (typeof result1 === 'number' && typeof result2 === 'number') {
        return result1 + result2;
      }

      if (typeof result1 === 'string' && typeof result2 === 'string') {
        return result1 + result2;
      }

      if (Array.isArray(result1) && Array.isArray(result2)) {
        return [...result1, ...result2];
      }

      if (isPlainObject(result1) && isPlainObject(result2)) {
        return { ...result1, ...result2 };
      }

      throw 'Unsupported data types';
    } catch {
      throw 'Unsupported data types';
    }
  });
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  // For null and undefined.
  if (value == null) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === null || prototype === Object.prototype;
}
```

### Approach 3: Using serial `await` (less precise coordination)

This version is shortest, but it is not the best interview answer because it observes `p1` before it observes `p2`. The promises passed to this function may already be running, but the returned promise will not react to `p2`'s fulfillment or rejection until `p1` has settled.

```ts
export default async function promiseMerge(
  p1: Promise<unknown>,
  p2: Promise<unknown>,
): Promise<unknown> {
  // Await both inputs directly, then reuse the same type-based merge rules.
  const result1 = await p1;
  const result2 = await p2;

  try {
    if (typeof result1 === 'number' && typeof result2 === 'number') {
      return result1 + result2;
    }

    if (typeof result1 === 'string' && typeof result2 === 'string') {
      return result1 + result2;
    }

    if (Array.isArray(result1) && Array.isArray(result2)) {
      return [...result1, ...result2];
    }

    if (isPlainObject(result1) && isPlainObject(result2)) {
      return { ...result1, ...result2 };
    }

    throw 'Unsupported data types';
  } catch {
    throw 'Unsupported data types';
  }
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  // For null and undefined.
  if (value == null) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === null || prototype === Object.prototype;
}
```

## Edge cases

- The manual approach still keeps the promises concurrent because both `then()` chains are attached immediately.
- If either promise rejects, the returned promise rejects with that same reason.
- Resolved values are mergeable only when both are the same supported shape: numbers, strings, arrays, or plain objects.
- Object merging is shallow; later properties from the second object override matching keys from the first object.
- `null`, dates, sets, maps, and mismatched supported types are outside the supported merge set and reject with `'Unsupported data types'`.
- The serial `await` version is easy to read, but it is worse at fail-fast coordination when `p2` rejects before `p1` settles.
