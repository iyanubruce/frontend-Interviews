# Class Variance Authority II

**Difficulty:** Hard

## Description

This is a follow-up to [Class Variance Authority](/questions/javascript/class-variance-authority).

Implement an enhanced simplified `cva` function. This version needs to support `base`, `variants`, `defaultVariants`, and `compoundVariants`.

You do not need to support `compoundVariants[].className` or top-level `class` / `className`.

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
  compoundVariants: [
    {
      intent: 'primary',
      size: 'medium',
      class: 'btn-primary-medium',
    },
    {
      intent: ['primary', 'secondary'],
      disabled: true,
      class: 'btn-disabled-interactive',
    },
  ],
});

button();
// 'btn btn-primary btn-medium btn-primary-medium'

button({ intent: 'secondary', disabled: true });
// 'btn btn-secondary btn-medium btn-disabled btn-disabled-interactive'
```

## Arguments

`cva(base, config)`

- `base` (`string | null | undefined`): Base classes that are always included.
- `config` (`object`, optional): Configuration for the generated function.  `variants`: An object whose keys are variant names and whose values map variant values to class names. `defaultVariants`: Default variant values to use when the returned function is called without that variant. `compoundVariants`: An array of entries that each contain:  Variant conditions keyed by variant name. Condition values that are either a single accepted value or an array of accepted values. A `class` field to append when all conditions match.

## Returns

Returns a function that accepts an object of selected variant values and returns the final class string.

## Notes

- Ignore unknown variant names in the returned function's argument.
- Ignore resolved variant values that do not exist in the corresponding variant map when adding normal variant classes.
- Match `compoundVariants` against the resolved variant values after applying `defaultVariants`.
- Append all matching compound variant `class` values after the normal variant classes, in `compoundVariants` array order.
- Join all truthy class names with a single space and no leading or trailing whitespace.

## Resources

- [`class-variance-authority` docs: Compound variants](https://cva.style/docs/getting-started/variants#compound-variants)
- [`class-variance-authority` on GitHub](https://github.com/joe-bell/cva)

## Files

| File | Contents |
| --- | --- |
| `class-variance-authority-ii.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
