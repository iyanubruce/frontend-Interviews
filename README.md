# Front End Interview Practice

A local collection of front end interview practice questions, starter code, and solutions, organised by question format. All content is sourced from [GreatFrontEnd](https://www.greatfrontend.com) and arranged here for focused study.

**What's inside**

| Section                                              | Questions | Format                                |
| ---------------------------------------------------- | --------- | ------------------------------------- |
| [`javascript functions/`](#javascript-functions)     | 214       | TypeScript + Vitest                   |
| [`user-interface/`](#user-interface-coding)          | 59 × 5    | HTML/CSS, React, Svelte, Vue, Angular |
| [`system design/`](#system-design)                   | 6 + 20    | Markdown guides and write-ups         |
| [`algorithms/`](#algorithms)                         | 92        | TypeScript + Vitest                   |
| [`blind-75-and-gfe-75.md`](./blind-75-and-gfe-75.md) | 75 + 73   | Curated question lists                |

Roughly 5,600 files in total.

## Repository layout

```
Frontend/
├── javascript functions/    214 utility/function questions
├── user-interface/          59 UI coding questions × 5 frameworks
│   ├── HTML and CSS/
│   ├── React/
│   ├── Svelte/
│   ├── Vue/
│   └── Angular/
├── system design/
│   ├── guidebook/           6 playbook chapters
│   └── questions/           20 system design questions
├── algorithms/              92 algorithmic coding questions
└── blind-75-and-gfe-75.md   Blind 75 and GFE 75 lists
```

## JavaScript functions

214 short function/utility questions (flatten, debounce, Promise helpers, React hooks, etc.). Each question lives in its own numbered folder:

```
1. flatten/
├── flatten.ts        starter file — implement the function here
├── tests.ts          Vitest test suite
├── question.md       prompt, examples, hints, companies
└── solution.md       reference solution with explanation
```

Import style in `tests.ts` matches the starter file, e.g. `import flatten from "./flatten";` with `describe/test/expect` imported from `vitest`.

## User interface coding

59 UI coding questions, each implemented for five frameworks. Every question folder contains:

```
08. Accordion/
├── question.md       description, requirements, companies, related questions
├── code/             starter project for that framework
└── solution/         reference implementation
```

Framework folders and their file styles:

| Folder          | Framework           | Notable files                                  |
| --------------- | ------------------- | ---------------------------------------------- |
| `HTML and CSS/` | Vanilla HTML/CSS/JS | `index.html`, `src/index.js`, `src/styles.css` |
| `React/`        | React + TypeScript  | `src/*.tsx`, `src/index.tsx`                   |
| `Svelte/`       | Svelte 5            | `src/*.svelte`, `src/index.js`                 |
| `Vue/`          | Vue 3               | `src/*.vue`, `src/main.js`                     |
| `Angular/`      | Angular             | `src/app/*.ts`, `*.component.html/css`         |

Each `code/` folder is a standalone project with its own `package.json` (some include `start`/`build` scripts, e.g. the vanilla Parcel setup and Angular CLI). For frameworks whose `package.json` has no scripts, add your preferred bundler/dev server (Vite, Parcel, etc.) to run them locally.

## System design

- `guidebook/` — the six chapters of the Front End System Design Playbook (introduction, types of questions, the RADIO framework, evaluation axes, common mistakes, cheatsheet).
- `questions/` — 20 system design write-ups (Autocomplete, News Feed, Google Docs, Netflix, etc.), each with the full solution, requirement exploration, data model, API design, optimizations, and "check your understanding" exercises.

Diagrams are written as fenced `mermaid` blocks, so they render natively on GitHub, GitLab, and VS Code (with a Mermaid extension).

## Algorithms

92 algorithmic coding questions, one folder per question:

```
25. Binary Search/
├── binary-search.ts   starter file (stubs throw "Not implemented!")
├── tests.ts           Vitest suite with sample test cases inlined
└── question.md        prompt, examples, hints, solution, exercises
```

## Curated lists

[`blind-75-and-gfe-75.md`](./blind-75-and-gfe-75.md) lists every question in the Blind 75 and GFE 75 study plans, grouped by category and difficulty, with links to the original study-plan pages.

## How to practise

1. Open a question's `question.md` and read the prompt without scrolling to the solution.
2. Implement your answer in the starter file (`code/` for UI questions, the `.ts` file for JavaScript/algorithms).
3. Run the tests until they pass.
4. Compare with the reference solution and read the explanation.

## Running the tests

JavaScript-function and algorithm suites use [Vitest](https://vitest.dev). Test files are named `tests.ts`, which Vitest does not pick up by default, so add a config in the folder you run from:

```ts
// vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: { include: ["**/tests.ts"] },
});
```

```sh
npm install --save-dev vitest typescript

npx vitest run                                  # run everything
npx vitest run "javascript functions/1. flatten/tests.ts"   # one suite
npx vitest run "algorithms/25. Binary Search/tests.ts"
```

For UI questions, `cd` into a question's `code/` or `solution/` folder, install its dependencies, and start its dev server.

## Conventions

- Numbered folders follow the order used on the GreatFrontEnd site (zero-padded so they sort correctly).
- `question.md` always starts with an `# H1` and includes difficulty, duration, topics, and a source link.
- `code/` is the unsolved starting point; `solution/` is the reference answer — never mix the two.
- Relative links between related questions point at the `question.md` of the sibling folder.
- Markdown is formatted with Prettier.

## Attribution

Questions, starter code, solutions, and explanations are the work of [GreatFrontEnd](https://www.greatfrontend.com) (Codeney Pte Ltd) and its contributors. This repository is a personal study copy; some questions are premium on the original site. Refer to the source links in each `question.md` for the canonical version.
