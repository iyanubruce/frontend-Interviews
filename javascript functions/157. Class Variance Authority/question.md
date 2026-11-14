# Class Variance Authority

**Difficulty:** Medium

## Description

[`class-variance-authority`](https://github.com/joe-bell/cva) is a utility for generating class names from a base class list and a set of variants.

Implement a simplified `cva` function. This version only needs to support `base`, `variants`, and `defaultVariants`. You do not need to support `compoundVariants`, `class`, or `className`.

## Examples

```js
const button = cva('btn', {
  variants: {
    intent: {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
    },
    size: {
      small: 'btn-small',
      medium: 'btn-medium',
    },
    disabled: {
      true: 'btn-disabled',
      false: null,
    },
  },
  defaultVariants: {
    intent: 'primary',
    size: 'medium',
    disabled: false,
  },
});

button(); // 'btn btn-primary btn-medium'
button({ size: 'small' }); // 'btn btn-primary btn-small'
button({ intent: 'secondary', disabled: true }); // 'btn btn-secondary btn-medium btn-disabled'
```

## Arguments

`cva(base, config)`

- `base` (`string | null | undefined`): Base classes that are always included.
- `config` (`object`, optional): Configuration for the generated function.  `variants`: An object whose keys are variant names and whose values map variant values to class names. `defaultVariants`: Default variant values to use when the returned function is called without that variant.

## Returns

Returns a function that accepts an object of selected variant values and returns the final class string.

## Notes

- Ignore unknown variant names in the returned function's argument.
- Ignore resolved variant values that do not exist in the corresponding variant map.
- Join all truthy class names with a single space and no leading or trailing whitespace.

## Resources

- [`class-variance-authority` on GitHub](https://github.com/joe-bell/cva)

## Files

| File | Contents |
| --- | --- |
| `class-variance-authority.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
