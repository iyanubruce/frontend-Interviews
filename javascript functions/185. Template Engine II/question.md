# Template Engine II

**Difficulty:** Medium

## Description

This is a follow-up to [Template Engine](/questions/javascript/template-engine).

Implement the same `renderTemplate(template, data)` API, but now with behavior that is closer to a real template renderer:

- Tags can use dotted paths such as `{{user.name}}`.
- Normal `{{...}}` tags should HTML-escape their output.
- Triple-brace tags like `{{{html}}}` should render raw output.
- Missing paths should still render as an empty string.

This question still keeps the engine intentionally small:

- `data` only contains plain objects and primitive values.
- Arrays are out of scope.
- Inputs are guaranteed valid.

## Examples

```js
renderTemplate('Hello {{user.name}}!', {
  user: { name: 'Alice' },
});
// 'Hello Alice!'
```

Normal tags should escape HTML.

```js
renderTemplate('{{content}}', {
  content: '<strong>Hello</strong>',
});
// '&lt;strong&gt;Hello&lt;/strong&gt;'
```

Triple-brace tags should render raw output.

```js
renderTemplate('{{{content}}}', {
  content: '<strong>Hello</strong>',
});
// '<strong>Hello</strong>'
```

## Arguments

`renderTemplate(template, data)` accepts the following arguments:

| Argument | Type | Description |
| --- | --- | --- |
| `template` | `string` | The template string containing `{{...}}` or `{{{...}}}` tags. |
| `data` | `Object` | A nested object containing plain objects and primitive values. |

## Returns

Returns a new rendered string.

## Notes

- Missing paths and resolved `null` / `undefined` values should render as an empty string.
- A path that resolves to an object should also render as an empty string.
- `false`, `0`, and `''` are valid resolved values and should still render.
- You do not need to support sections, loops, or malformed templates in this question.

## Files

| File | Contents |
| --- | --- |
| `template-engine-ii.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
