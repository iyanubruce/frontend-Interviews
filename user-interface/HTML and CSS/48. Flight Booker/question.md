# Flight Booker

**Difficulty:** Easy · **Duration:** ~15 min · **Topics:** A11y, Forms

> Source: [flight-booker](https://www.greatfrontend.com/questions/user-interface/flight-booker/vanilla)

## Description

Build a component that books a one-way or round-trip flight for specified dates.

### Requirements

- The user can choose from two flight options: "One-way flight" and "Round-trip flight".
- Input date fields
  - The date input fields represent the departure and return dates.
  - The return date input is displayed if the "Round-trip flight" option is chosen and hidden otherwise.
- Form validation should be done upon submission for invalid fields:
  - The dates are in the past.
  - The return date is before the departure date.
- Upon successful submission, a message is displayed informing the user of the selection:
  - One-way flight: "You have booked a one-way flight on YYYY-MM-DD"
  - Round-trip flight: "You have booked a round-trip flight, departing on YYYY-MM-DD and returning on YYYY-MM-DD"

## Project structure

```
├── src
│   ├── index.js
│   └── styles.css
├── index.html
└── package.json
```

- `code/` – starter files for the question.
- `solution/` – reference solution files.

## Asked at these companies

- Openai
- Reddit
- Airbnb
