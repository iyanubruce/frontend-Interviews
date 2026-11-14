# getElementsByStyle — Solution

This is a DOM traversal problem with one important CSS detail: match against the browser's resolved styles, not just inline styles.

## Solution

Use a depth-first traversal over the element subtree:

1. Start from the root element's children, because the root itself should not be included in the result.
2. For each visited element, call `getComputedStyle(element).getPropertyValue(property)`.
3. If the resolved value matches `value`, add the element to the results.
4. Recurse into `element.children`.

`element.children` is the right traversal API here because it skips text and comment nodes. `getComputedStyle()` is the right style API because this question cares about the final rendered value after the cascade, inheritance, shorthands, and CSS variables are resolved.

As in the class-name and tag-name traversal questions, visit descendants in document order, never evaluate the root argument as a candidate, and collect matches in an array.

### Why use `getComputedStyle()` instead of `element.style`

`element.style` only reflects inline styles. This question needs the actual rendered value, so `getComputedStyle()` is the correct API.

```ts
// Assuming a typical <body> element with no inline styles specified.

console.log(document.body.style.fontSize); // '' (empty string)
console.log(getComputedStyle(document.body).getPropertyValue('font-size')); // 16px;
```

## What are computed styles and why are they important?

Take a closer look at `Window.getComputedStyle()`. According to MDN, it returns the property values **after applying active stylesheets and resolving any basic computation those values may contain**. Obtaining resolved styles is important because:

1. **Styles can be applied in many ways**: There are many ways to style an element on a webpage:  **Inline**: Directly within the HTML tag. **Internal**: With a `<style>` tag. **External**: Linking to a separate CSS file.
2. **Styles follow cascading and inheritance rules**: CSS works by cascading styles – rules from different sources combine and potentially override each other. Elements can also inherit styles from their parent elements.
3. **Multiple ways of defining style properties**: Style properties can be written in forms other than their final resolved values:  **Many value types**: Some properties, like colors, can be written in different ways. For example, `color: white`, `color: #fff`, and `color: rgb(255, 255, 255)` are all valid ways to render white text. **Shorthands**: Properties can be defined using shorthands, e.g. `margin: 10px` results in `margin-top: 10px` and corresponding values for the other directions. **CSS variables**: Properties can also be written using CSS variables, more officially known as CSS custom properties, e.g. `color: var(--text-color)`. The final color value is not known until the browser resolves the value of the `--text-color` variable.
4. **Styles must be resolved**: `getComputedStyle()` returns the calculated styles applied to an element after cascading and inheritance rules have been applied, so the comparison uses resolved styles rather than only inline declarations.

Using `Window.getComputedStyle()` limits matching to the element's resolved values. Font sizes, paddings, and margins can be defined using `px`, `rem`, `em`, etc., but the resolved value unit for these properties obtained from `getComputedStyle()` is `px`. Colors can be defined using [named colors, HSL, RGB (and more) formats](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value), but the resolved style usually appears as an `rgb(...)` or `rgba(...)` string. This limitation is worth mentioning during interviews when relevant.

```ts
element.style.color = 'white';
console.log(getComputedStyle(element).getPropertyValue('color')); // 'rgb(255, 255, 255)'
```

Writing custom conversion or resolution logic inside `getElementsByStyle()` can resolve the value argument before comparing against the element's resolved styles, but that only works for properties that do not rely on properties of other elements. Properties like `inherit` and `rem`, which rely on properties of other elements due to CSS cascading, cannot be matched easily and accurately.

## Recursive traversal

Both depth-first and breadth-first traversals can be used, but it's easier to write depth-first traversals using recursion. When visiting each element:

1. Call `getComputedStyle(element)` to get a `CSSStyleDeclaration` object containing the resolved styles of the specified element. `getPropertyValue(property)` is used to retrieve the value of a specific CSS property such as `color`, `font-size`, `margin`, etc. Then compare it against the property and value arguments.
2. Recursively traverse the element's children via `element.children`.

Maintain an `elements` array to collect the matching elements while recursively traversing from the root element. Remember that the root element argument itself is not included in the results and it should not be added to the `elements` array.

For a root with two descendants, the traversal shape is:

| Visited node | Included in search? | Style check | Next step |
| --- | --- | --- | --- |
| Root argument | no | skipped | Visit its `children` |
| Child element | yes | compare computed property value | Visit child element's `children` |
| Text/comment node | no | skipped by `element.children` | none |
| Matching descendant | yes | push into result array | Continue traversal |

This is why the approach loops over `element.children` first instead of calling the helper on the root argument itself.

```ts
export default function getElementsByStyle(
  element: Element,
  property: string,
  value: string,
): Array<Element> {
  const elements: Array<Element> = [];

  function traverse(el: Element) {
    if (el == null) {
      return;
    }

    // Computed styles include values coming from stylesheets, not just inline styles.
    const computedStyles = getComputedStyle(el);
    if (computedStyles.getPropertyValue(property) === value) {
      elements.push(el);
    }

    for (const child of el.children) {
      traverse(child);
    }
  }

  for (const child of element.children) {
    traverse(child);
  }

  return elements;
}
```

## Edge cases

- The element argument is not included in the results even if it matches the specified style.
- Empty trees and no-match trees should return an empty array.
- Text and comment nodes are ignored because the traversal uses `element.children`.
- Value arguments must be in the format of the resolved styles; for example, colors must be in `rgb()`/`rgba()` format to match.
- `querySelectorAll()` is not a substitute here because CSS selectors cannot generally ask for "computed property equals this resolved value".

## Techniques

- Recursion
- DOM APIs
- Reading computed styles with `getComputedStyle()`
- Traversing descendants with `element.children`

## Resources

- [Window: getComputedStyle() method - Web APIs | MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window/getComputedStyle)
