# Tabs II

**Difficulty:** Medium · **Duration:** ~20 min · **Topics:** A11y

> Source: [tabs-ii](https://www.greatfrontend.com/questions/user-interface/tabs-ii/angular)

## Description

**Note:** This is an advanced version of [Tabs](https://www.greatfrontend.com/questions/user-interface/tabs); you should complete that question first before attempting this one.

> Tabs are a set of layered sections of content, known as tab panels, that display one panel of content at a time. Each tab panel has an associated tab element, that when activated, displays the panel. The list of tab elements is arranged along one edge of the currently displayed panel, most commonly the top edge.

_Source: [Tabs Pattern | ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)_

In [Tabs](https://www.greatfrontend.com/questions/user-interface/tabs), we built a functional tabs component that displays one panel of content at a time depending on the active tab element. However, building good UI components goes beyond functionality, and we need to ensure our components have great accessibility as well by adding the right ARIA roles, states, and properties to the DOM elements.

### Requirements

The ARIA Authoring Practices Guide has a [long list of guidelines for the ARIA roles, states, and properties to add to the various elements of a tabs component](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/#wai-ariaroles,states,andproperties).

Implement the following guidelines for this question:

- The element that serves as the container for the set of tabs has the role `tablist`.
- Each element that serves as a tab has the role `tab` and is contained within the element with the role `tablist`.
- Each element that contains the content panel for a `tab` has the role `tabpanel`.
- Each element with role `tab` has the property `aria-controls` referring to its associated `tabpanel` element.
- The active tab element has the state `aria-selected` set to `true` and all other tab elements have it set to `false`.
- Each element with role `tabpanel` has the property `aria-labelledby` referring to its associated tab element.

It is also important that we use a `<button>` element to build the tabs, as they need to be focusable and interactive.

### Notes

The skeleton code uses the solution of [Tabs](https://www.greatfrontend.com/questions/user-interface/tabs), but you are free to use your own solution as a starting point.

## Project structure

```
├── src
│   ├── app
│   │   ├── app.component.html
│   │   ├── app.component.ts
│   │   ├── app.module.ts
│   │   ├── tabs.component.html
│   │   └── tabs.component.ts
│   ├── index.html
│   ├── main.ts
│   └── styles.css
├── angular.json
├── package.json
├── tsconfig.app.json
├── tsconfig.json
└── tsconfig.spec.json
```

- `code/` – starter files for the question.
- `solution/` – reference solution files.

## Asked at these companies

- Airbnb
- Amazon

## Next questions

- [Tabs III](../07.%20Tabs%20III/question.md) – Medium
