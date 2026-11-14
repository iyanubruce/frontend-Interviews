# Template Engine II — Solution

Part II starts from the single-pass replacement model in part I, but each matched tag now carries two extra decisions: how to resolve nested data and whether the rendered output should be HTML-escaped.

The model is a tiny tokenizer plus a lookup formatter. The regex does not build a full syntax tree because this part has no sections, loops, or malformed input recovery. Each match is independent and can be treated as `{ mode, path }`: choose raw vs escaped mode from the brace count, resolve the dotted path, format the resolved value, and optionally escape the resulting string.

There are three pieces:

1. Find both `{{...}}` and `{{{...}}}` tags in one global regex pass.
2. Resolve the tag path by walking the object one dotted segment at a time.
3. Convert the resolved value to a string, then escape it only for normal double-brace tags.

The regex has one capture group for triple-brace tags and another for double-brace tags. Triple braces land in the raw-output path; double braces land in the escaped-output path. After picking the matched path and trimming it, `resolvePath()` starts at the root data object and follows each segment from `path.split('.')`.

That path walk has a simple condition: after each segment, `current` is the value at the path prefix already consumed. If the next segment is missing or `current` is no longer a non-null object, the path cannot be resolved and the replacement becomes `''`.

`formatValue()` keeps the output rules centralized: missing paths, `null`, `undefined`, and objects render as `''`, while primitive values are converted with `String(...)`. The last step is conditional escaping. Normal `{{...}}` tags escape `&`, `<`, `>`, `"`, and `'`; triple-brace `{{{...}}}` tags return the formatted value as-is.

For the same data value, the brace count decides only the final escaping step:

| Tag | Resolved value | Formatted value | Returned replacement |
| --- | --- | --- | --- |
| `{{user.name}}` | `'Alice'` | `'Alice'` | escaped `'Alice'` |
| `{{content}}` | `'<strong>Hello</strong>'` | `'<strong>Hello</strong>'` | `&lt;strong&gt;Hello&lt;/strong&gt;` |
| `{{{content}}}` | `'<strong>Hello</strong>'` | `'<strong>Hello</strong>'` | `<strong>Hello</strong>` |
| `{{missing.path}}` | `undefined` | `''` | `''` |

```ts
export type TemplatePrimitive = null | undefined | boolean | number | string;
export type TemplateValue = TemplatePrimitive | TemplateObject;
export type TemplateObject = { [key: string]: TemplateValue };

const TOKEN_REGEX = /{{{\s*([^{}]+?)\s*}}}|{{\s*([^{}]+?)\s*}}/g;
const HTML_ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

function resolvePath(
  path: string,
  data: TemplateObject,
): TemplateValue | undefined {
  let current: TemplateValue = data;

  for (const segment of path.split('.')) {
    if (
      typeof current !== 'object' ||
      current === null ||
      !Object.hasOwn(current, segment)
    ) {
      return undefined;
    }

    current = current[segment];
  }

  return current;
}

function formatValue(value: TemplateValue | undefined): string {
  if (value == null || typeof value === 'object') {
    return '';
  }

  return String(value);
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => HTML_ESCAPE_MAP[character]);
}

export default function renderTemplate(
  template: string,
  data: TemplateObject,
): string {
  return template.replace(
    TOKEN_REGEX,
    (_, rawPath: string | undefined, escapedPath: string | undefined) => {
      // Triple braces land in `rawPath`; double braces land in `escapedPath`.
      const path = (rawPath ?? escapedPath ?? '').trim();
      const renderedValue = formatValue(resolvePath(path, data));

      return rawPath != null ? renderedValue : escapeHtml(renderedValue);
    },
  );
}
```

## Common pitfalls

- **Escaping before converting to the supported output shape:** Resolve and format the value first, then escape the resulting string. This keeps missing values and objects as `''` and avoids trying to escape non-string values directly.
- **Letting path lookup continue through primitives:** If a path segment resolves to a primitive, the next segment cannot be read from it. Return `undefined` as soon as the current value is not an object, is `null`, or does not own the next segment.
- **Treating triple braces as a different lookup mode:** Triple braces change only the escaping behavior. They should resolve the same dotted paths and follow the same missing-value rules as normal double braces.
- **Dropping falsy primitives:** `0`, `false`, and `''` are resolved values and should render as strings. Only missing paths, `null`, `undefined`, and objects render as an empty string.

## Notes

- Triple braces change only the escaping behavior, not the path lookup.
- Returning `''` for objects keeps the prompt focused on primitive interpolation.
- Escaping `&`, `<`, `>`, `"`, and `'` covers the common HTML-sensitive characters for this question.
- A regex-based scan is reasonable here because tags are flat. Once sections or nesting are introduced, a parser is easier to justify than adding more capture groups.
