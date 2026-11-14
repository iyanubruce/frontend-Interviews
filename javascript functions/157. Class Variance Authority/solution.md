# Class Variance Authority — Solution

After [Classnames](/questions/javascript/classnames), this question builds on the same idea with a fixed configuration object and a returned resolver function. Keep that configuration in a closure and resolve classes on demand instead of precomputing every possible variant combination.

## Solution

`cva()` is a small class-name resolver factory. The outer function captures the static configuration, and the returned function combines that configuration with one set of runtime props.

Split the work into two jobs:

1. `cva()` captures `base`, `variants`, and `defaultVariants`.
2. The returned resolver walks through the configured variants, decides the effective value for each one, and appends the matching class names.

The resolver's class-building order is:

1. Start with `base` when it is truthy.
2. Iterate only over the configured `variants`.
3. For each variant, read from `props` first and fall back to `defaultVariants` only when that prop is missing or nullish.
4. Skip nullish resolved values.
5. Convert the resolved value with `String()` before looking it up in the variant map.
6. Append the variant class only when the mapped class value is truthy.

Order comes from the configuration, not from the runtime props object. That keeps output deterministic and lets defaults and provided props share the same variant iteration path.

The boolean conversion is important because object keys are strings. A variant value of `false` should look up the configured `'false'` key, not be treated as "no value". The class value found at that key can still be falsy, and falsy class values should be skipped so they do not add extra spaces or words such as `"false"`.

Using nullish fallback is also deliberate. A prop of `false` should override a default of `true`, while a missing prop or `null`/`undefined` should fall back to the default variant for that variant name.

| Variant | Prop value | Default value | Effective key | Appended class |
| --- | --- | --- | --- | --- |
| `intent` | missing | `'primary'` | `'primary'` | `'btn-primary'` |
| `size` | `'small'` | `'medium'` | `'small'` | `'btn-small'` |
| `disabled` | `false` | `true` | `'false'` | skipped when mapped to `null` |
| `tone` | `'ghost'` | missing | `'ghost'` | skipped when key is unknown |

```ts
export type ClassValue = string | false | null | undefined;
export type VariantValue = string | boolean | null | undefined;
export type VariantClasses = Record<string, ClassValue>;
export type VariantSchema = Record<string, VariantClasses>;
export type VariantSelection = Record<string, VariantValue>;

export interface CVAConfig {
  variants?: VariantSchema;
  defaultVariants?: VariantSelection;
}

export default function cva(
  base?: ClassValue,
  config: CVAConfig = {},
): (props?: VariantSelection) => string {
  const { variants = {}, defaultVariants = {} } = config;

  return function getClassName(props: VariantSelection = {}): string {
    const classes: Array<string> = [];

    if (base) {
      classes.push(base);
    }

    for (const variantName in variants) {
      if (!Object.hasOwn(variants, variantName)) {
        continue;
      }

      const variantMap = variants[variantName];
      // Props win when present; otherwise fall back to the configured
      // default for that single variant.
      const variantValue = props[variantName] ?? defaultVariants[variantName];

      if (variantValue == null) {
        continue;
      }

      // Variant maps are object-keyed, so booleans like true/false must be
      // normalized into string keys before lookup.
      const variantClass = variantMap[String(variantValue)];

      if (variantClass) {
        classes.push(variantClass);
      }
    }

    return classes.join(' ');
  };
}
```

## Common pitfalls

- Do not iterate over `props`. Extra runtime keys are ignored unless they correspond to configured variants.
- Do not skip boolean `false` before lookup. `false` is a valid variant value and should become the key `'false'`.
- Do skip nullish variant values because they mean there is no selected value after props and defaults are combined.
- Do not append falsy class values. The config type allows `false`, `null`, and `undefined` to mean "no class for this value".
- Defaults are per variant. A provided prop for one variant should not prevent defaults for other variants from applying.

## Notes

- Only iterate over the configured `variants`. Extra keys in the props object should be ignored.
- Convert boolean values such as `true` and `false` to strings before using them as object keys.
- If a resolved variant value does not exist in the variant map, skip it.

## Techniques

- Closures
- Working with objects and dynamic keys
- Handling defaults and falsy values

## Resources

- [`class-variance-authority` on GitHub](https://github.com/joe-bell/cva)
