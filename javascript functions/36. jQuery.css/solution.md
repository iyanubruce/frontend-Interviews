# jQuery.css — Solution

Here the important part is modeling a tiny slice of jQuery's getter/setter API. A closure-based object instance keeps the selected element private and makes chaining explicit.

## Clarification questions

- What should happen if no element matches the selector? Like jQuery, do nothing for setters and return `undefined` for getters.
- What should happen when reading a CSS property that is not set? Return `undefined`, not an empty string.

## Solution

### Approach 1: Closure-backed object instance

Capture the matched element once, then return an object with a `css()` method.

- If `value` is omitted, treat the call as a getter and read from `element.style[prop]`.
- If `value` is provided, treat the call as a setter and write to the style object.
- In the setter path, return `this` so calls can be chained.

This closure-based version stores the selected element and returns the same wrapper after each setter.

The selected element is looked up when `$()` is called, not on every `css()` call. That means a wrapper created for a missing selector still has to be safe: getters return `undefined`, and setters simply return the wrapper so a chain can continue without throwing.

| Call shape | Behavior | Return value |
| --- | --- | --- |
| `$('button').css('color')` | Getter | Stored style value or `undefined` |
| `$('button').css('color', 'red')` | Setter | The wrapper object for chaining |
| `$('missing').css('color', 'red')` | No-op setter | The wrapper object for chaining |

```ts
interface JQuery {
  css: (
    prop: string,
    value?: boolean | string | number,
  ) => JQuery | string | undefined;
}

export default function $(selector: string): JQuery {
  const element = document.querySelector(selector) as HTMLElement | null;

  return {
    css: function (prop, value) {
      // Getter case.
      if (value === undefined) {
        // No matching elements.
        if (element == null) {
          return undefined;
        }

        const value = element.style[prop as any];
        return value === '' ? undefined : value;
      }

      // Setter case.
      if (element != null) {
        element.style[prop as any] = String(value);
      }

      return this;
    },
  };
}
```

### Approach 2: Class-based wrapper

A class can hold the matched element on an instance field and implement the same `css()` method. The behavior is the same, with slightly more structure for the same amount of logic.

```ts
class jQuery {
  private element: HTMLElement | null;
  constructor(selector: string) {
    this.element = document.querySelector<HTMLElement>(selector);
  }

  css(
    prop: string,
    value?: boolean | string | number,
  ): this | string | undefined {
    // Getter case.
    if (value === undefined) {
      // No matching elements.
      if (this.element == null) {
        return undefined;
      }

      const value = this.element.style[prop as any];
      return value === '' ? undefined : value;
    }

    // Setter case.
    if (this.element != null) {
      this.element.style[prop as any] = String(value);
    }

    return this;
  }
}

export default function $(element: string): jQuery {
  return new jQuery(element);
}
```

## Edge cases

- No element matches the selector. Handle it gracefully instead of throwing.
- Return `undefined` instead of an empty string when a CSS property has not been set.
- `0`, `false`, and empty strings are provided values, so they should take the setter path. Only an omitted second argument is a getter.

## Techniques

- Closures
- Object chaining

## Notes

Do not define `css` as an arrow function if `return this` should refer to the wrapper object. Arrow functions capture `this` lexically instead of getting it from the call site.

## Resources

- [jQuery.css() | jQuery API Documentation](https://api.jquery.com/css/)
