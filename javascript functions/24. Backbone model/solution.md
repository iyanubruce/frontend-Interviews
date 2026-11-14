# Backbone Model — Solution

This follow-up combines attribute storage with per-attribute subscriptions. Each attribute needs to remember both its current value and the callbacks listening for `change` and `unset`, so the cleanest model is one record per attribute.

**Note:** This question builds on [Event Emitter II](/questions/javascript/event-emitter-ii), so that earlier question is useful background.

## Clarification questions

Clarify these model semantics before coding because they decide how subscriptions and state updates interact.

1. How should values be compared for the `'change'` event?  Strict equality can be used.
2. Can the same callback be added multiple times for the same attribute and event?  Yes, it can be. It will be called once for each time it is added when the event is emitted, in the order the callbacks were added.
3. Can non-existent events be emitted?  Yes, but nothing should happen and the code should not error or crash.
4. What should the `this` value of the callbacks be if it's not specified?  It can be `null`.
5. Can `model.off()` be called more than once?  Yes, it can be. It should ignore callbacks that were not added.
6. Can callbacks contain code that invokes methods on the emitter instance?  Yes, but that scenario is out of scope for this question.
7. What if the added callbacks throw an error when an event is fired?  The error should be caught and not halt the rest of the execution. However, this case is not tested.

The solution handles all the cases above except the last two.

## Solution

Use a `Map` from attribute name to an object that stores:

1. The current value for that attribute.
2. A `change` callback bucket.
3. An `unset` callback bucket.
4. The optional `context` that each callback should run with.

That keeps reads, writes, and subscriptions all centered around the same attribute record.

```ts
type CallbackData = { fn: Function; context: any };
type AttributeData = {
  value: unknown;
  events: {
    change: Array<CallbackData>;
    unset: Array<CallbackData>;
  };
};

export default class BackboneModel {
  _attributes: Map<string, AttributeData>;
}
```

A concrete example:

```ts
Map(2) {
  'name': {
    value: 'John Doe',
    events: {
      change: [
        { fn: Function1, context: Object },
        { fn: Function2, context: Object },
      ],
      unset: [
        { fn: Function3, context: Object },
      ],
    }
  },
  'age': {
    value: 30,
    events: {
      change: [],
      unset: [
        { fn: Function4, context: Object }
      ]
    }
  },
};
```

`set()` and `unset()` are state updates plus targeted event dispatch:

1. `get()` and `has()` only read the attribute record.
2. `set()` reads or creates the attribute record, saves the previous value, and stores the new value before firing `change` callbacks. Listeners can read the updated value through `get()`, while the saved previous value remains available as the third callback argument.
3. `unset()` looks up the attribute, fires that attribute's `unset` callbacks, and removes the record from the map.
4. `on()` and `off()` only mutate the callback bucket for one attribute and one event, preserving the optional callback context for later `.call(...)`.

Each method reads or updates the relevant attribute record in the map.

Trace for a model initialized with `{ name: 'John' }`:

| Operation | Attribute record before | Event behavior | Attribute record after |
| --- | --- | --- | --- |
| `on('change', 'name', cb)` | value `'John'`, no callbacks | no event fires while subscribing | value `'John'`, `change: [cb]` |
| `set('name', 'Jane')` | value `'John'` | call `cb('name', 'Jane', 'John')` | value `'Jane'` |
| `set('name', 'Jane')` | value `'Jane'` | no change event because value is equal | value `'Jane'` |
| `unset('name')` | value `'Jane'` | call `unset` callbacks for `name` | record removed |

This also explains why subscribing to a missing attribute is a no-op in this implementation: there is no attribute record, so there is no callback bucket to attach to.

```ts
type EventName = 'change' | 'unset';

interface IBackboneModel {
  get(attribute: string): unknown | undefined;
  set(attribute: string, value: unknown): void;
  has(attribute: string): boolean;
  unset(attribute: string): void;
  on(
    eventName: EventName,
    attribute: string,
    callback: Function,
    context?: any,
  ): void;
  off(eventName: EventName, attribute: string, callback: Function): void;
}

type CallbackData = { fn: Function; context: any };
type AttributeData = {
  value: unknown;
  events: {
    change: Array<CallbackData>;
    unset: Array<CallbackData>;
  };
};

// You are free to use alternative approaches of
// defining BackboneModel as long as the
// default export can be instantiated.
export default class BackboneModel implements IBackboneModel {
  _attributes: Map<string, AttributeData>;

  constructor(initialValues: Record<string, unknown> = {}) {
    this._attributes = new Map();
    Object.entries(initialValues).forEach(([attribute, value]) => {
      this._attributes.set(attribute, {
        value,
        events: {
          change: [],
          unset: [],
        },
      });
    });
  }

  get(attribute: string): unknown | undefined {
    return this._attributes.get(attribute)?.value;
  }

  set(attribute: string, value: unknown): void {
    const attributeData: AttributeData = this.has(attribute)
      ? this._attributes.get(attribute)!
      : {
          value,
          events: {
            change: [],
            unset: [],
          },
        };

    const previousValue = attributeData.value;
    attributeData.value = value;
    this._attributes.set(attribute, attributeData);

    // Commit first so listeners can read the new value or make another change.
    if (previousValue !== value) {
      attributeData.events.change.forEach((callback) => {
        callback.fn.call(
          callback.context ?? null,
          attribute,
          value,
          previousValue,
        );
      });
    }
  }

  has(attribute: string): boolean {
    return this._attributes.has(attribute);
  }

  unset(attribute: string): void {
    const attributeData = this._attributes.get(attribute);
    // No-op for non-existent attributes.
    if (attributeData == null) {
      return;
    }

    // Emit unset while the record is still present, then remove it entirely.
    attributeData.events.unset.forEach((callback) => {
      callback.fn.call(callback.context ?? null, attribute);
    });
    this._attributes.delete(attribute);
  }

  on(
    eventName: EventName,
    attribute: string,
    callback: Function,
    context?: any,
  ): void {
    const attributeData = this._attributes.get(attribute);
    // No-op for non-existent attributes.
    if (attributeData == null) {
      return;
    }

    // Add to the list of callbacks.
    attributeData.events[eventName].push({
      fn: callback,
      context,
    });
  }

  off(eventName: EventName, attribute: string, callback: Function): void {
    const attributeData = this._attributes.get(attribute);
    // No-op for non-existent attributes.
    if (attributeData == null) {
      return;
    }

    // Remove from the added list of callbacks.
    attributeData.events[eventName] = attributeData.events[eventName].filter(
      ({ fn }) => fn !== callback,
    );
  }
}
```

## Edge cases

- The same callback function can be added more than once for the same event. Calling `model.off()` should remove all matching callbacks from that attribute's event callbacks.
- Methods called with nonexistent attributes should be no-ops.
- Event callbacks are isolated per model instance because each instance owns its own `_attributes` map.
- Setting a new attribute after a failed `on()` call for that missing attribute should not call the callback.

## Techniques

- Object-oriented programming
- Using the right data structures
- Closures

## Resources

- [Backbone.Model](https://backbonejs.org/#Model)
