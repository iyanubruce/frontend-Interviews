# Accordion II

**Difficulty:** Medium · **Duration:** ~20 min · **Topics:** A11y

> Source: [accordion-ii](https://www.greatfrontend.com/questions/user-interface/accordion-ii/react)

## Description

**Note:** This is an advanced version of [Accordion](https://www.greatfrontend.com/questions/user-interface/accordion), and you should complete that question first before attempting this question.

> An accordion is a vertically stacked set of interactive headings that each contain a title, content snippet, or thumbnail representing a section of content. The headings function as controls that enable users to reveal or hide their associated sections of content. Accordions are commonly used to reduce the need to scroll when presenting multiple sections of content on a single page.

_Source: [Accordion Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/)_

In [Accordion](https://www.greatfrontend.com/questions/user-interface/accordion), we built a functional accordion component that can expand/collapse each section's contents. However, building good UI components goes beyond functionality and we have to ensure our components have great accessibility as well by adding the appropriate ARIA roles, states, and properties to the DOM elements.

### Requirements

The ARIA Authoring Practices Guide has a [long list of guidelines for the ARIA roles, states, and properties to add to the various elements of an accordion](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/). We should implement the following (improvised) guidelines for this question:

- The title of each accordion header is contained in a `<button>` element.
- If the accordion panel associated with an accordion header is visible, the header button element has `aria-expanded` set to `true`. If the panel is not visible, `aria-expanded` is set to `false`.
- The accordion header button element has `aria-controls` set to the ID of the element containing the accordion panel content.
- Each element that serves as a container for panel content has role `region` and `aria-labelledby` with a value that refers to the button that controls display of the panel.

### Notes

The skeleton code uses the solution of [Accordion](https://www.greatfrontend.com/questions/user-interface/accordion), but you are free to use your own solution as a starting point.

## Project structure

```
├── public
│   └── index.html
├── src
│   ├── accordion.tsx
│   ├── app.tsx
│   ├── index.tsx
│   └── styles.css
├── package.json
└── tsconfig.json
```

- `code/` – starter files for the question.
- `solution/` – reference solution files.

## Asked at these companies

- Amazon

## Next questions

- [Accordion III](../10.%20Accordion%20III/question.md) – Medium
