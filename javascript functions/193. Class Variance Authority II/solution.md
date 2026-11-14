# Class Variance Authority II — Solution

This follow-up builds directly on [Class Variance Authority](/questions/javascript/class-variance-authority) by adding `compoundVariants` support while keeping the rest of the simplified API unchanged.

## Solution

The main state here is `resolvedVariants`: a record of the final value for each configured variant after combining `props` with `defaultVariants`. Every later decision, including compound matching, should read from this single resolved record instead of reinterpreting raw props.

The code naturally splits into two passes:

1. Resolve each configured variant from `props` or `defaultVariants`, store that value in `resolvedVariants`, and append the matching normal variant class if one exists.
2. Reuse `resolvedVariants` to check every `compoundVariants` entry, and append its `class` whenever all of its conditions match.

The first pass keeps the same rules as part I:

- `props` take precedence for the specific variant being resolved.
- `defaultVariants` apply only when the prop is missing or nullish.
- Boolean values are converted to string keys for normal variant-class lookup.
- Nullish values and falsy class values are skipped when appending classes.

Only own entries in a variant map define classes. Checking membership before reading the class prevents inherited properties such as `constructor` from being treated as configured values.

For compound variants, each condition can be either:

- A single expected value, which should match with strict equality.
- An array of accepted values, which should match with `includes()`.

Doing it in two passes keeps the logic easy to follow because compound matching never has to recompute defaults or re-read `props`. It just checks the already-resolved state. A compound variant matches only when every condition other than `class` matches; if any condition fails, that compound class is skipped.

This also means defaults participate in compound matching. For example, if `defaultVariants` resolves `size` to `'medium'`, a compound variant with `{ size: 'medium', class: '...' }` should match even when the caller omits `size`.

For `button({ intent: 'secondary', disabled: true })` with defaults `{ intent: 'primary', size: 'medium', disabled: false }`:

| Variant | Prop value | Default value | Resolved value | Normal class |
| --- | --- | --- | --- | --- |
| `intent` | `'secondary'` | `'primary'` | `'secondary'` | `btn-secondary` |
| `size` | omitted | `'medium'` | `'medium'` | `btn-medium` |
| `disabled` | `true` | `false` | `true` | `btn-disabled` |

A compound condition like `{ intent: ['primary', 'secondary'], disabled: true }` then matches against the resolved values and appends its class after the normal variant classes.

```ts
export type ClassValue = string | false | null | undefined;
export type VariantValue = string | boolean | null | undefined;
export type VariantClasses = Record<string, ClassValue>;
export type VariantSchema = Record<string, VariantClasses>;
export type VariantSelection = Record<string, VariantValue>;
export type CompoundVariantValue = VariantValue | Array<VariantValue>;
export type CompoundVariant = Record<string, CompoundVariantValue> & {
  class: ClassValue;
};

export interface CVAConfig {
  variants?: VariantSchema;
  defaultVariants?: VariantSelection;
  compoundVariants?: Array<CompoundVariant>;
}

function matchesCompoundVariant(
  compoundVariant: CompoundVariant,
  resolvedVariants: VariantSelection,
): boolean {
  for (const variantName in compoundVariant) {
    if (
      !Object.hasOwn(compoundVariant, variantName) ||
      variantName === 'class'
    ) {
      continue;
    }

    const expectedValue = compoundVariant[variantName];
    const resolvedValue = resolvedVariants[variantName];

    // Arrays mean "any of these values" for one compound condition.
    if (Array.isArray(expectedValue)) {
      if (!expectedValue.includes(resolvedValue)) {
        return false;
      }

      continue;
    }

    if (resolvedValue !== expectedValue) {
      return false;
    }
  }

  return true;
}

export default function cva(
  base?: ClassValue,
  config: CVAConfig = {},
): (props?: VariantSelection) => string {
  const { variants = {}, defaultVariants = {}, compoundVariants = [] } = config;

  return function getClassName(props: VariantSelection = {}): string {
    const classes: Array<string> = [];
    // Resolve every variant once so the compound pass can reuse the same
    // props-vs-default precedence that normal variants use.
    const resolvedVariants: VariantSelection = {};

    if (base) {
      classes.push(base);
    }

    for (const variantName in variants) {
      if (!Object.hasOwn(variants, variantName)) {
        continue;
      }

      const variantMap = variants[variantName];
      const variantValue = props[variantName] ?? defaultVariants[variantName];

      resolvedVariants[variantName] = variantValue;

      if (variantValue == null) {
        continue;
      }

      const variantKey = String(variantValue);

      if (!Object.hasOwn(variantMap, variantKey)) {
        continue;
      }

      const variantClass = variantMap[variantKey];

      if (variantClass) {
        classes.push(variantClass);
      }
    }

    // Compound checks happen after the first pass so they can read the fully
    // resolved variant state without recomputing it.
    for (const compoundVariant of compoundVariants) {
      if (!matchesCompoundVariant(compoundVariant, resolvedVariants)) {
        continue;
      }

      if (compoundVariant.class) {
        classes.push(compoundVariant.class);
      }
    }

    return classes.join(' ');
  };
}
```

## Common pitfalls

- Do not match compound variants against raw `props` only. Defaults must affect compound matching too.
- Do not include the `class` property as a condition. It is the output to append after the other conditions match.
- Treat an array condition as "any of these values", not as a value that must be strictly equal to the resolved value.
- Keep normal variant lookup scoped to configured `variants`; `compoundVariants` can add classes, but they do not define new normal variants.
- This follow-up supports `class` only inside `compoundVariants`; `className` remains out of scope.

## Notes

- Only configured `variants` participate in the normal variant-class lookup.
- `defaultVariants` affect both normal variant classes and compound variant matching.
- This follow-up supports `class` only inside `compoundVariants`; `className` remains out of scope.

## Techniques

- Closures
- Working with objects and dynamic keys
- Reusing resolved state across multiple passes

## Resources

- [`class-variance-authority` docs: Compound variants](https://cva.style/docs/getting-started/variants#compound-variants)
- [`class-variance-authority` on GitHub](https://github.com/joe-bell/cva)
