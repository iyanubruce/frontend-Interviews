# jQuery Class Manipulation — Solution

**Note:** Complete the [`jQuery.css`](/questions/javascript/jquery-css) question first.

This follow-up manages class tokens through a chainable DOM API. Keep class membership exact without `classList`, preserve chainability with `return this`, and use `toggleClass` as the shared implementation for add and remove.

## Clarification questions

- What should happen if there are no elements matching the selector?  In jQuery, when there are no matched elements, nothing occurs, so follow that.
- Can there be duplicate classes in the parameters and on the element?  Yes, there can be.

## Solution

The real challenge here is not method chaining. It is normalizing class strings and applying `toggleClass` rules consistently without `classList`.

Treat both the incoming `className` string and the element's existing `className` as normalized sets of tokens:

- trim outer whitespace,
- split on runs of whitespace,
- ignore duplicates.

That token set is the substitute for `DOMTokenList`. Since the prompt disallows `classList`, the helper has to make token membership explicit instead of using substring checks on `element.className`.

Once those sets exist, `toggleClass` becomes a per-class state transition:

- `state === true`: ensure the class exists.
- `state === false`: ensure the class does not exist.
- `state === undefined`: flip the class based on whether the element currently has it.

Because both sides are sets, duplicates collapse naturally and each class is updated at most once. After processing, join the normalized element classes back into a single `className` string.

`addClass` and `removeClass` can stay small by delegating to `toggleClass` with an explicit boolean state.

Trace for an element starting with `"foo bar baz"`:

| Call | Input set | Element set before | Rule | Element class after |
| --- | --- | --- | --- | --- |
| `toggleClass('qux foo')` | `{ qux, foo }` | `{ foo, bar, baz }` | flip each token | `"bar baz qux"` |
| `addClass('bar corge')` | `{ bar, corge }` | `{ bar, baz, qux }` | force present | `"bar baz qux corge"` |
| `removeClass('baz')` | `{ baz }` | `{ bar, baz, qux, corge }` | force absent | `"bar qux corge"` |

```ts
interface JQuery {
  toggleClass: (className: string, state?: boolean) => JQuery;
  addClass: (className: string) => JQuery;
  removeClass: (className: string) => JQuery;
}

function classNameTokenSet(className: string): Set<string> {
  return new Set(className.trim().split(/\s+/));
}

export default function $(selector: string): JQuery {
  const element = document.querySelector(selector);

  return {
    toggleClass: function (className: string, state?: boolean): JQuery {
      // No-op if there is no matching element.
      if (element == null) {
        return this;
      }

      const classes = classNameTokenSet(className);
      const elementClasses = classNameTokenSet(element.className);

      classes.forEach((cls) => {
        // `undefined` means "toggle"; otherwise `state` forces add/remove.
        const shouldRemove =
          state === undefined ? elementClasses.has(cls) : !state;
        shouldRemove ? elementClasses.delete(cls) : elementClasses.add(cls);
      });

      element.className = Array.from(elementClasses).join(' ');
      return this;
    },
    addClass: function (className: string): JQuery {
      this.toggleClass(className, true);
      return this;
    },
    removeClass: function (className): JQuery {
      this.toggleClass(className, false);
      return this;
    },
  };
}
```

## Alternative solution

The class-based version below expresses the same rules with more structure. It can be a reasonable fit when helpers for parsing and mutation are useful, but it is longer than necessary for the interview-sized solution.

```ts
function classNameTokenSet(className: string): Set<string> {
  return new Set(className.trim().split(/\s+/));
}

class jQuery {
  private element: Element | null;
  constructor(selector: string) {
    this.element = document.querySelector(selector);
  }

  toggleClass(className: string, state?: boolean): this | undefined {
    // No-op if there is no matching element.
    if (this.element == null) {
      return undefined;
    }

    const classes = classNameTokenSet(className);
    const elementClasses = classNameTokenSet(this.element.className);

    classes.forEach((cls) => {
      // `undefined` means "toggle"; otherwise `state` forces add/remove.
      const shouldRemove =
        state === undefined ? elementClasses.has(cls) : !state;
      shouldRemove ? elementClasses.delete(cls) : elementClasses.add(cls);
    });

    this.element.className = Array.from(elementClasses).join(' ');
    return this;
  }
  addClass(className: string): this {
    this.toggleClass(className, true);
    return this;
  }
  removeClass(className: string): this {
    this.toggleClass(className, false);
    return this;
  }
}

export default function $(element: string): jQuery {
  return new jQuery(element);
}
```

## Edge cases

- No elements match the selector. Handle this gracefully instead of erroring.
- The `className` string can contain duplicate classes.
- The `className` string can contain leading/trailing whitespace and also more than one space character between classes.
- The element's `className` can contain uppercase classes that should not be matched in [Standards Mode for browsers](https://developer.mozilla.org/en-US/docs/Web/HTML/Quirks_Mode_and_Standards_Mode).

## Techniques

- CSS fundamentals.

## Notes

- Arrow functions capture `this` lexically, so they are a poor fit for these chainable object methods. Use regular functions so `return this` refers to the wrapper object.
- `addClass()` and `removeClass()` are not separate algorithms; they are `toggleClass()` with the state forced to `true` or `false`.

## Resources

- [.toggleClass() | jQuery API Documentation](https://api.jquery.com/toggleClass/)
- [.addClass() | jQuery API Documentation](https://api.jquery.com/addClass/)
- [.removeClass() | jQuery API Documentation](https://api.jquery.com/removeClass/)
