# Traffic Light

**Difficulty:** Medium · **Duration:** ~20 min · **Topics:** Async

> Source: [traffic-light](https://www.greatfrontend.com/questions/user-interface/traffic-light/angular)

## Description

### Requirements

Build a traffic light where the lights switch from green to yellow to red after predetermined intervals and loop indefinitely. Each light should be lit for the following durations:

- Red light: 4000ms
- Yellow light: 500ms
- Green light: 3000ms

Expose the current light with an accessible label and polite live announcement, and hide the purely visual lights from assistive technology.

You are free to exercise your creativity to style the appearance of the traffic light.

## Project structure

```
├── src
│   ├── app
│   │   ├── app.component.css
│   │   ├── app.component.html
│   │   ├── app.component.ts
│   │   ├── app.module.ts
│   │   ├── traffic-light.component.css
│   │   ├── traffic-light.component.html
│   │   └── traffic-light.component.ts
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

- Roblox
- Snowflake
- Reddit

## Similar questions

- [Digital Clock](../20.%20Digital%20Clock/question.md) – Medium
