# Stopwatch

**Difficulty:** Medium · **Duration:** ~30 min · **Topics:** Async

> Source: [stopwatch](https://www.greatfrontend.com/questions/user-interface/stopwatch/react)

## Description

Build a stopwatch widget which can measure how much time has passed. It shows the current timer and has two buttons underneath: "Start/Stop" and "Reset".

### Requirements

- Start/Stop Button: Starts/stops the timer depending on whether the timer is running.
- Reset: Resets the timer to 0 and stops the timer.
- Display the elapsed time as a button, formatted into hours, minutes, seconds, and two-digit hundredths of a second. Leading zero-valued hour and minute segments may be omitted.
  - Complete units should carry at their exact boundaries rather than overflow into the smaller unit.
  - Clicking on the timer should start/stop the timer. The Start/Stop button's label should update accordingly as well.

You are free to exercise your creativity to style the appearance of the stopwatch. You can try out [Google's stopwatch widget](https://www.google.com/search?q=stopwatch) for inspiration and an example.

## Project structure

```
├── public
│   └── index.html
├── src
│   ├── app.tsx
│   ├── index.tsx
│   ├── stopwatch.tsx
│   └── styles.css
├── package.json
└── tsconfig.json
```

- `code/` – starter files for the question.
- `solution/` – reference solution files.

## Asked at these companies

- Cisco
- Uber
- Shopify
- Reddit

## Similar questions

- [Digital Clock](../20.%20Digital%20Clock/question.md) – Medium
