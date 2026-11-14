# Progress Bars III

**Difficulty:** Medium · **Duration:** ~25 min · **Topics:** Async

> Source: [progress-bars-iii](https://www.greatfrontend.com/questions/user-interface/progress-bars-iii/vue)

## Description

**Note:** This is an advanced version of [Progress Bars II](https://www.greatfrontend.com/questions/user-interface/progress-bars-ii); you should complete that question first before attempting this question.

In [Progress Bars II](https://www.greatfrontend.com/questions/user-interface/progress-bars-ii), we built progress bars that fill up in sequence, one at a time. In this question, we'll build progress bars where multiple of them fill up concurrently, up to a limit of 3. The fourth progress bar only starts filling up after the first one is full.

### Requirements

- Clicking on the "Add" button adds a progress bar to the page.
- The progress bars fill up gradually in parallel, up to a limit of 3 concurrent bars filling up; in other words, the fourth progress bar will only start filling up after the first progress bar is completely filled up.
- Each bar takes approximately 2000ms to completely fill up.

## Project structure

```
├── public
│   └── index.html
├── src
│   ├── App.vue
│   ├── main.js
│   └── styles.css
└── package.json
```

- `code/` – starter files for the question.
- `solution/` – reference solution files.

## Asked at these companies

- Uber

## Next questions

- [Progress Bars IV](../56.%20Progress%20Bars%20IV/question.md) – Hard
