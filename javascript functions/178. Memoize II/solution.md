# Memoize II — Solution

This follow-up expands the cache key from one argument to an argument list. The main design question is how to represent "these exact arguments, in this exact order" without losing type information or making the lookup logic too complex.

## Solution

Start with the `Map` plus serialized-key version in interviews. It is enough for this question's restricted input types, and it keeps the cache logic easy to explain.

### Approach 1: `Map`-based cache and serialized arguments as cache key

The core rule is simple: if the same arguments appear again, return the cached result instead of calling `func` again.

This breaks down into three parts:

#### Determining the cache key

The cache key needs a one-to-one relationship with the arguments that `func` can be called with. Since the input types are strings and numbers, that key can be safely derived from the argument list.

A first attempt at constructing a hash function for the arguments could be to use `args.join('_')` (or some other token), but this has a few issues:

1. If the string contains `_`, the hashes can collide. For example, both `['hello_', 'world']` and `['hello', '_world']` will result in `hello_world` as the key.
2. Numbers are not differentiated from strings. For example, both `['1', 'foo']` and `[1, 'foo']` will result in `1_foo` as the key.

Hashing is tricky, and one built-in function one built-in function to use is `JSON.stringify()`. It adds double quotes around strings, effectively differentiating numbers and strings, and correctly segments the parameters within the stringified result. Note that `JSON.stringify()` works only because of the restriction on string and number inputs. If there are other types of inputs like `Set`, `JSON.stringify()` by default turns them into `{}` regardless of contents and will no longer produce a unique value for unique argument combinations.

This makes the cache-key semantics explicit:

- Argument order matters, so `['a', 'b']` and `['b', 'a']` are different keys.
- Argument count matters, so `['1']` and `['1', '']` are different keys.
- Argument type matters for the supported inputs, so `1` and `'1'` stay distinct.
- `this` is not part of the key, matching part 1.

#### Deciding on a structure for the cache

Cache lookups should be fast, ideally `O(1)`. In JavaScript, both objects and `Map`s can serve as key-value stores. Since the derived key is a string, either works, but `Map` is a clean default.

The returned function has access to the cache via closures. Because of closures, each memoized function instance has its own cache.

#### Using the cache

Before invoking the original function `func`, the memoized function first checks whether the `cache` already contains an entry for the current arguments (using `JSON.stringify(args)` as the key). This will result in one of the following two scenarios:

1. The cache contains an entry for `key`. A cached result exists, which means that the function has been called with the same arguments before, and there is no need to recompute the result. In this case, the memoized function simply returns the cached result using `cache.get(key)`.
2. The cache does not contain an entry for these `args`. In that case, call the original function with `Function.prototype.apply()` so the original `this` value is preserved, store the result under `key`, and return it.

For a memoized multiply function:

| Call | Serialized key | Cache state | Action |
| --- | --- | --- | --- |
| `memoized(3, 4)` | `[3,4]` | miss | call `func`, store `12` |
| `memoized(3, 4)` | `[3,4]` | hit | return cached `12` |
| `memoized('3', 4)` | `["3",4]` | miss | separate key because type differs |
| `memoized()` | `[]` | independent key | supports zero-argument functions |

```ts
type Fn<T> = (this: any, ...args: Array<any>) => T;

export default function memoize<T>(func: Fn<T>): Fn<T> {
  const cache = new Map<string, T>();

  return function (this: any, ...args) {
    // JSON.stringify is enough here because the question limits args to strings and numbers.
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = func.apply(this, args);
    cache.set(key, result);

    return result;
  };
}
```

### Approach 2: Trie-based cache

Instead of constructing one string key out of the arguments, use each argument as one step in a trie. This approach implements `Trie` and `TrieNode` classes with `set`, `has`, and `get` methods that mirror the `Map` interface closely enough that the rest of the memoization logic barely changes.

The trie approach stores the argument list structurally:

1. Start at the root node.
2. For each argument, follow or create the child node for that exact argument value.
3. Store the result at the final node.
4. For zero-argument calls, store a value at the root and track that this root value exists.

This avoids serializer collisions and naturally supports non-string keys because each edge is backed by a `Map`. It is larger, though: it requires node classes, traversal logic, and special handling for zero arguments. It can reduce duplicated key-storage work, but it is not the best first answer in an interview unless the prompt pushes in that direction.

```ts
type Fn<T> = (this: any, ...args: Array<any>) => T;

export default function memoize<T>(func: Fn<T>): Fn<T> {
  const cache = new Trie<T>();

  return function (this: any, ...args: Array<any>) {
    if (cache.has(args)) {
      return cache.get(args)!;
    }

    const result = func.apply(this, args);
    cache.set(args, result);

    return result;
  };
}

class TrieNode<T> {
  _value: T | undefined;
  _nodes: Map<any, TrieNode<T>>;

  constructor(value?: T) {
    this._value = value;
    this._nodes = new Map<any, TrieNode<T>>();
  }

  getValue(): T | undefined {
    return this._value;
  }

  setValue(value: T): void {
    this._value = value;
  }

  hasKey(nodeKey: any): boolean {
    return this._nodes.has(nodeKey);
  }

  getNode(nodeKey: any): TrieNode<T> | undefined {
    return this._nodes.get(nodeKey);
  }

  addNode(nodeKey: any): TrieNode<T> {
    const newNode = new TrieNode<T>();
    this._nodes.set(nodeKey, newNode);
    return newNode;
  }
}

class Trie<T> {
  _rootNode: TrieNode<T>;
  _hasValueForUndefined: boolean;

  constructor() {
    this._rootNode = new TrieNode<T>();
    this._hasValueForUndefined = false;
  }

  set(args: Array<any>, value: T): void {
    if (args.length === 0) {
      if (this._hasValueForUndefined) {
        return;
      }

      this._hasValueForUndefined = true;
      this._rootNode.setValue(value);
      return;
    }

    let currNode: TrieNode<T> = this._rootNode;
    // Each argument becomes one trie level, so shared prefixes reuse the same path.
    for (const arg of args) {
      const nextNode = currNode.getNode(arg);
      if (nextNode != null) {
        currNode = nextNode;
      } else {
        currNode = currNode.addNode(arg);
      }
    }

    currNode.setValue(value);
  }

  has(args: Array<any>): boolean {
    if (args.length === 0) {
      return this._hasValueForUndefined;
    }

    let currNode: TrieNode<T> = this._rootNode;
    for (const arg of args) {
      const nextNode = currNode.getNode(arg);
      if (nextNode == null) {
        return false;
      }
      currNode = nextNode;
    }

    return true;
  }

  get(args: Array<any>): T | undefined {
    if (args.length === 0) {
      return this._rootNode.getValue();
    }

    let currNode: TrieNode<T> = this._rootNode;
    for (const arg of args) {
      currNode = currNode.getNode(arg)!;
    }

    return currNode.getValue();
  }
}
```

## Common pitfalls

- In practice, functions can take arguments of varying types beyond strings and numbers, so the current `memoize` implementation wouldn't be sufficient for those cases.
- Although `this` can be accessed without issues, the results are memoized solely on the input arguments, so the same memoized result is returned for the same input arguments even if the `this` value is different between calls.

## Notes

- Use `cache.has(key)` before `cache.get(key)` so falsy cached results are still reused correctly.
- `JSON.stringify(args)` is acceptable here because the prompt limits arguments to strings and numbers. A production serializer would need to define behavior for objects, symbols, functions, `undefined`, circular values, and other types.
- The trie version shifts complexity from serialization to data structure management. It is more general about key identity, but it is also more code to explain and test.
