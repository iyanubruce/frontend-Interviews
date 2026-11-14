# Progress Bars IV

**Difficulty:** Hard · **Duration:** ~25 min · **Topics:** Async

> Source: [progress-bars-iv](https://www.greatfrontend.com/questions/user-interface/progress-bars-iv/angular)

## Description

**Note:** This is an advanced version of [Progress Bars III](https://www.greatfrontend.com/questions/user-interface/progress-bars-iii). You should complete that question first before attempting this one.

In [Progress Bars III](https://www.greatfrontend.com/questions/user-interface/progress-bars-iii), we built progress bars that fill up in parallel, with multiple of them filling up concurrently, up to a limit of 3. In this question, we'll allow pausing and resuming of the animation.

### Requirements

- Initially there will be one empty progress bar.
- The progress bars fill up gradually in parallel, up to a limit of 3 concurrent bars filling up. I.e. the fourth progress bar will only start filling up after the third progress bar is completely filled up.
- Each bar takes approximately 2000ms to completely fill up.
- Implement the following buttons with the functionality:
  - Start/Pause: Starts/pauses the filling up of the progress bars. The button label turns into "Pause" when the animation is playing.
  - Add: Appends a new progress bar to the bottom of the list without changing whether the animation is playing or paused. If the animation is playing after all existing bars have filled, the new bar starts filling automatically.
  - Reset: Resets to the initial state where there is only one empty bar and stops any running animations.
- Do not keep an animation timer running while every bar is full.

### Example

![Progress Bars Example](https://www.gfecdn.net/img/questions/progress-bars-iv/progress-bars-example.png)

## Project structure

```
├── src
│   ├── app
│   │   ├── app.component.ts
│   │   └── app.module.ts
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

- Uber
- Dropbox
