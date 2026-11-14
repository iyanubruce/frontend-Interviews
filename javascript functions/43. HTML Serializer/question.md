# HTML Serializer

**Difficulty:** Medium

## Description

Given an object that resembles a DOM tree, implement a function that serializes the object into a formatted string with proper indentation (one tab (`\t` character) per nesting level) and one tag per line.

## Examples

```js
const tree = {
  tag: 'body',
  children: [
    { tag: 'div', children: [{ tag: 'span', children: ['foo', 'bar'] }] },
    { tag: 'div', children: ['baz'] },
  ],
};

serializeHTML(tree);
// Output:
`<body>
  <div>
    <span>
      foo
      bar
    </span>
  </div>
  <div>
    baz
  </div>
</body>`;
```

## Files

| File | Contents |
| --- | --- |
| `html-serializer.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
