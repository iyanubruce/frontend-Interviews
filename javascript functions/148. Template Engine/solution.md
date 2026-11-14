# Template Engine — Solution

The template contains plain text with independent `{{...}}` placeholders. Use a single regex pass to find each supported tag and replace it immediately.

The replacement pass has a narrow rule: literal text outside a tag is copied unchanged, and each supported tag independently contributes exactly one output string.

The main responsibility is to preserve the difference between "missing" and "present but falsy":

- A key that is not present in the flat `data` object renders as `''`.
- A present key with `null` or `undefined` also renders as `''`.
- A present primitive value such as `false`, `0`, or `''` is valid and should be converted with `String(...)`.

The global regular expression matches every `{{...}}` tag and captures only the key inside the braces. Trimming the captured key makes `{{name}}` and `{{ name }}` behave the same way. Since this part only supports flat lookup, the captured key can be checked directly on `data` with `Object.hasOwn()`.

A regex is sufficient because each supported tag is independent. There is no nested syntax, escaping rule, or section state to carry across matches.

For `{{count}}/{{enabled}}/{{missing}}`, the replacement decisions are:

| Tag | Data state | Replacement |
| --- | --- | --- |
| `count` | own key with `0` | `'0'` |
| `enabled` | own key with `false` | `'false'` |
| `missing` | no own key | `''` |

```ts
export type TemplateValue = null | undefined | boolean | number | string;
export type TemplateData = Record<string, TemplateValue>;

const VARIABLE_REGEX = /{{\s*([^{}]+?)\s*}}/g;

export default function renderTemplate(
  template: string,
  data: TemplateData,
): string {
  return template.replace(VARIABLE_REGEX, (_, key: string) => {
    if (!Object.hasOwn(data, key)) {
      return '';
    }

    const value = data[key];
    return value == null ? '' : String(value);
  });
}
```

## Common pitfalls

- **Treating falsy values as missing:** Do not use a broad truthiness check such as `if (!data[key])`. That would erase valid values like `0`, `false`, and `''`. Check whether the object owns the key first, then only collapse `null` and `undefined` to an empty string.
- **Looking through the prototype chain:** Use `Object.hasOwn()` instead of `key in data` when deciding whether a tag is available. The renderer should only interpolate values supplied directly in the data object, not inherited properties.
- **Solving more than this part asks for:** Nested paths, sections, escaping, and malformed templates are intentionally out of scope here. A direct regex replacement is enough because every supported tag is independent.

## Notes

- `Object.hasOwn()` helps distinguish a missing key from an inherited property.
- Converting with `String(...)` preserves values such as `false` and `0`.
- Since this question only supports flat lookups, no path parsing is needed yet.
