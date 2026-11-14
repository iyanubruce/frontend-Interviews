# Deep Set — Solution

Focus on mutable path traversal: walk to the parent of the target key, create any missing containers along the way, then write the value in place.

## Solution

Treat the path as a list of segments and walk the object until traversal reaches the parent of the final key. During the walk, `current` always points at the container targeted by the next write.

Start by normalizing the path. A string like `'a.0.b'` becomes a list of segments, and array paths can already contain strings or numbers. Once the path is normalized, the traversal logic is the same for both forms.

### Walking the path

At each step:

- Read the current child value.
- If it is already a non-null object, keep traversing into it.
- Otherwise, create a new container based on the next segment:  If the next segment is numeric, create an array. Otherwise create an object.

Peeking at the next segment is the important interview detail. That is how the traversal knows whether a missing branch should become `[]` or `{}`.

### Writing the leaf

Once traversal reaches the parent container, assign the final segment to `value`.

This function intentionally mutates the original object instead of rebuilding a new structure. Replacing missing or primitive intermediate branches keeps the condition simple: after each loop iteration, `current` is a container and traversal can continue.

For `deepSet(object, 'a.0.b.1', 2)`, container creation is driven by the next segment:

| Current segment | Next segment | Container created at current segment |
| --- | --- | --- |
| `a` | `0` | `[]` because the next segment is numeric |
| `0` | `b` | `{}` because the next segment is a property name |
| `b` | `1` | `[]` because the next segment is numeric |
| `1` | N/A | Write the final value `2` |

Existing containers are reused instead of replaced. If `items` is already an array, the traversal writes into that array; if `config` is `true` and the path continues through `config.theme`, the primitive is replaced because it cannot hold the next segment.

```ts
type PathSegment = string | number;
type Path = string | Array<PathSegment>;
type Container = Record<PathSegment, unknown> | Array<unknown>;

function normalizePath(path: Path): Array<PathSegment> {
  if (Array.isArray(path)) {
    return path;
  }

  return path.split('.').map((segment) => {
    return /^\d+$/.test(segment) ? Number(segment) : segment;
  });
}

function isContainer(value: unknown): value is Container {
  return value !== null && typeof value === 'object';
}

function isArrayIndex(segment: PathSegment): boolean {
  if (typeof segment === 'number') {
    return Number.isInteger(segment) && segment >= 0;
  }

  return /^\d+$/.test(segment);
}

function createContainer(nextSegment: PathSegment): Container {
  // Look ahead to decide whether the missing branch should be an array or object.
  return isArrayIndex(nextSegment) ? [] : {};
}

function getValue(container: Container, segment: PathSegment): unknown {
  if (Array.isArray(container)) {
    return container[Number(segment)];
  }

  return container[segment];
}

function setValue(
  container: Container,
  segment: PathSegment,
  value: unknown,
): void {
  if (Array.isArray(container)) {
    container[Number(segment)] = value;
    return;
  }

  container[segment] = value;
}

export default function deepSet(
  obj: Container,
  path: Path,
  value: unknown,
): void {
  const segments = normalizePath(path);
  let current: Container = obj;

  for (let i = 0; i < segments.length - 1; i += 1) {
    const segment = segments[i];
    const nextSegment = segments[i + 1];
    const existing = getValue(current, segment);

    if (!isContainer(existing)) {
      // Overwrite missing or primitive branches so traversal can keep going.
      setValue(current, segment, createContainer(nextSegment));
    }

    current = getValue(current, segment) as Container;
  }

  // The last segment receives the final value without any extra merging logic.
  setValue(current, segments[segments.length - 1], value);
}
```

## Common pitfalls

- Choosing the new container from the current segment instead of the next segment. The next segment indicates whether the child must support array indexing.
- Stopping when an intermediate branch is primitive. The intended behavior is to replace that branch with a new container and continue.
- Rebuilding and returning a new object. This utility mutates `obj` in place.
- Adding leaf merge behavior here. The basic version always overwrites the final segment.

## Notes

- The key interview detail is peeking at the next segment so arrays and objects are created in the right places.
- Replacing primitive intermediate values keeps the traversal logic simple and matches the intended utility behavior.
- Bracket syntax, prototype-pollution hardening, and immutable writes are out of scope for this interview-sized version.
