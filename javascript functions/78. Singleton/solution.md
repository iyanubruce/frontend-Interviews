# Singleton — Solution

A singleton here is a reference identity guarantee: every caller should receive the same `Map` object from the same module instance. The code only needs private module state; allocating a new `Map` inside each call would break that guarantee even if the public API looked right.

## Solution

The ES module version is the best default because modules already provide singleton-like state with the least code and the clearest modern shape.

Object identity is the point here, not immutability. Callers may mutate the shared `Map`; the singleton promise is that every caller sees the same `Map` reference within the same module instance.

### Approach 1: ES6 modules

Since each file in the coding workspace is a module, and ES modules are evaluated once per module instance, this behavior can implement the Singleton pattern. This module exports an object with a single method, `getInstance`. The `getInstance` method is responsible for providing access to the `globalMap` instance. When other parts of the application import this module and call `getInstance`, they receive a reference to the same `globalMap` instance.

Reference identity is the guarantee: every successful call to `getInstance()` from the same module graph returns the exact same `Map` object. The map can mutate, but the module should never replace it with a fresh instance per caller.

| Step | Operation | Shared map state |
| --- | --- | --- |
| 1 | file A calls `getInstance()` | returns `globalMap` |
| 2 | file A writes `count = 42` | stored on `globalMap` |
| 3 | file B calls `getInstance()` | receives the same `globalMap` |
| 4 | file B reads `count` | sees `42` |

```ts
const globalMap = new Map();

export default {
  getInstance() {
    return globalMap;
  },
};
```

### Approach 2: ES6 modules with lazy instantiation

In the first solution, the `Map` instance was instantiated from the start. However, when instantiation is expensive and there is a good chance the instance is never needed, a lazy instantiation approach is better.

In this modified version, the `getInstance` method checks if `globalMap` has been instantiated before creating a new instance. If `globalMap` is already instantiated, it simply returns the existing instance. This way, the map is created only when the `getInstance` method is called for the first time, making the instantiation lazy. The usage remains the same.

```ts
let globalMap: Map<any, any>;

export default {
  getInstance() {
    if (globalMap === undefined) {
      globalMap = new Map();
    }

    return globalMap;
  },
};
```

### Approach 3: Immediately Invoked Function Expression (IIFE)

Before ES modules were common, an immediately invoked function expression (IIFE) could be used to encapsulate data and create a module-like scope. In this version, the entire Singleton pattern is wrapped in an IIFE, creating a closure that encapsulates the `globalMap` variable. The `getInstance` method is exposed through the returned object, allowing access to the shared map instance.

```ts
const GlobalMap = (function () {
  const _privateMap = new Map();

  return {
    getInstance: function () {
      return _privateMap;
    },
  };
})();

export default GlobalMap;
```

In general, the ES module version is preferred in modern JavaScript. However, in an environment that does not support ES modules (older browsers, Node.js without module support, etc.), an IIFE is a common way to encapsulate and structure the code.

The class-based singleton pattern often appears in textbooks, but JavaScript modules already provide private module scope. Using that existing scope is the smallest implementation that satisfies the same access rule.

## Edge cases

- Every caller should receive the same shared instance, not a fresh `Map`.
- Lazy instantiation only changes when the instance is created, not the fact that there should be only one instance.
- The singleton is scoped to this module instance. Separate JavaScript realms, duplicated bundles, or test module resets can create separate module instances; those cases are outside this prompt.

## Notes

- The ES module approach is usually the clearest modern answer because module evaluation already provides private shared state.

## Resources

- [Singleton Pattern | patterns.dev](https://www.patterns.dev/vanilla/singleton-pattern)
- [How To Work With Singletons in JavaScript](https://www.digitalocean.com/community/tutorials/js-js-singletons)
