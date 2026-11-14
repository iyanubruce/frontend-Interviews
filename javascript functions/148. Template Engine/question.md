# Template Engine

**Difficulty:** Medium

## Description

Templating engines turn a string like `Hello {{name}}!` into rendered output by replacing placeholders with data.

In this question, implement `renderTemplate(template, data)`, a simplified Mustache-like renderer.

This question is intentionally small:

- Only simple variable tags such as `{{name}}` and `{{ name }}` need to be supported.
- `data` is a flat object of primitive values.
- Missing keys should render as an empty string.
- Inputs are guaranteed valid.

## Examples

```js
renderTemplate('Hello {{name}}!', { name: 'Alice' });
// 'Hello Alice!'

renderTemplate('{{greeting}}, {{name}}!', {
  greeting: 'Hi',
  name: 'Sam',
});
// 'Hi, Sam!'
```

Whitespace inside tags should be ignored.

```js
renderTemplate('{{ count }} items left', { count: 3 });
// '3 items left'
```

Missing keys should render as empty strings.

```js
renderTemplate('Hello {{name}} {{surname}}!', { name: 'Alice' });
// 'Hello Alice !'
```

## Arguments

`renderTemplate(template, data)` accepts the following arguments:

| Argument | Type | Description |
| --- | --- | --- |
| `template` | `string` | The template string containing `{{...}}` placeholders. |
| `data` | `Object` | A flat object whose values are primitive values. |

## Returns

Returns a new string with all placeholders replaced.

## Notes

- `false`, `0`, and `''` are valid values and should still render.
- Resolved `null` and `undefined` values should render as an empty string.
- You do not need to support nested paths, sections, or malformed templates in this question.

## Files

| File | Contents |
| --- | --- |
| `template-engine.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
