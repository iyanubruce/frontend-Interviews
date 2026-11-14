# jQuery.css

**Difficulty:** Easy

## Description

In vanilla JavaScript, styles can be set on an element as follows:

```js
const buttonEl = document.querySelector('button');
buttonEl.style.color = 'red';
buttonEl.style.backgroundColor = 'tomato';
buttonEl.style.fontSize = '16px';
```

[jQuery](https://jquery.com/) is a library that simplifies DOM manipulation (among other things). With jQuery (using the `$` alias function), the above can be simplified into:

```js
const buttonEl = $('button');
buttonEl.css('color', 'red');
buttonEl.css('backgroundColor', 'tomato');
buttonEl.css('fontSize', '16px');
```

The return value of most jQuery manipulation APIs is the jQuery object itself, so that method calls can be chained. The above can be further simplified again:

```js
$('button')
  .css('color', 'red')
  .css('backgroundColor', 'tomato')
  .css('fontSize', '16px');
```

Additionally, if the second parameter is omitted, the value of that style property is returned.

```js
// <button style="color: red">Submit</button>
$('button').css('color'); // 'red'
```

Implement the jQuery single-character function `$`, which only needs to support the `css()` method that either gets the value of an inline style property or sets a CSS property on the matched element.

## Notes

There are some differences from the official `jQuery.css()` implementation:

- The official library selects all matched elements and modifies all matched elements. However, for this question, assume there will be at most one element matching the selector.
- jQuery understands both `.css('background-color')` and `.css('backgroundColor')` and returns the correct value, but only the latter syntax has to be supported.
- Getting an inline style property that has not been set should return `undefined`.
- If no element matches the selector, getters should return `undefined` and setters should remain chainable no-ops.

## Files

| File | Contents |
| --- | --- |
| `jquery-css.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
