# Tabs III

**Difficulty:** Medium · **Duration:** ~20 min · **Topics:** A11y

> Source: [tabs-iii](https://www.greatfrontend.com/questions/user-interface/tabs-iii/vue)

## Description

**Note:** This is an advanced version of [Tabs II](https://www.greatfrontend.com/questions/user-interface/tabs-ii); you should complete that question first before attempting this one. The keyboard interactions require careful focus management regardless of framework.

In [Tabs II](https://www.greatfrontend.com/questions/user-interface/tabs-ii), we built a functional Tabs component that has the necessary [WAI-ARIA roles, states, and properties](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/#wai-ariaroles,states,andproperties). For a completely accessible Tabs component, we should also add the [necessary keyboard interactions](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/#keyboardinteraction).

### Requirements

We'll be following a modified subset of the [necessary keyboard interactions for Tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/#keyboardinteraction). Note that the tabs component we're building is activated automatically on focus, so the respective tabpanel contents are shown as soon as the focus changes to a different tab.

- When the <kbd>Tab</kbd> key is pressed:
  - When focus moves into the tab list, places focus on the active tab element.
  - When the tab list contains the focus, moves focus to the next element in the page tab sequence outside the tablist, which is the tabpanel.
- When focus is on a tab element in the tab list:
  - <kbd>Left Arrow</kbd>: Moves focus to the previous tab. If focus is on the first tab, moves focus to the last tab.
  - <kbd>Right Arrow</kbd>: Moves focus to the next tab. If focus is on the last tab element, moves focus to the first tab.
  - <kbd>Home</kbd>: Moves focus to the first tab. Shows tabpanel content of the newly focused tab.
  - <kbd>End</kbd>: Moves focus to the last tab. Shows tabpanel content of the newly focused tab.

### Notes

The focus of this question is on adding keyboard functionality, not styling. We have provided the solution to [Tabs II](https://www.greatfrontend.com/questions/user-interface/tabs-ii) here for you to build on top of. You can reuse the existing styling.

## Project structure

```
├── public
│   └── index.html
├── src
│   ├── App.vue
│   ├── main.js
│   ├── styles.css
│   └── Tabs.vue
└── package.json
```

- `code/` – starter files for the question.
- `solution/` – reference solution files.

## Asked at these companies

- Airbnb
- Amazon
