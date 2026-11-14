# Mortgage Calculator

**Difficulty:** Easy · **Duration:** ~20 min · **Topics:** A11y, Forms

> Source: [mortgage-calculator](https://www.greatfrontend.com/questions/user-interface/mortgage-calculator/vue)

## Description

Build a simple mortgage calculator widget that takes a loan amount, interest rate, and loan term, then calculates the monthly mortgage payment, total payment amount, and total interest paid.

### Requirements

- The user should be able to enter:
  - Loan amount ($)
  - Annual interest rate (%). This is also known as the annual percentage rate (APR)
  - Loan term (in years)
- Using the inputs, the calculator should compute the following and display the results to the user:
  - Monthly mortgage payment
  - Total payment amount
  - Total interest paid
- If a non-numeric string is entered into any input field, the calculator should display an error message. Additionally, the calculator should handle any other invalid inputs that may arise.
- Round the result amounts to two decimal places.

_The last two requirements might not be given to you during interviews; you're expected to clarify._

The formula for calculating the monthly payment is:

**M = P(i(1+i)n)/((1+i)n - 1)**

- M: Monthly mortgage payment
- P: Loan amount
- i: Monthly interest rate (APR / 12)
- n: Total number of payments (loan term in years multiplied by 12)

Here's an example of [Google's mortgage calculator](https://www.google.com/search?q=mortgage+calculator) (you might need to be in the US for it to appear):

![Google's mortgage calculator widget](https://www.gfecdn.net/img/questions/mortgage-calculator/google-mortgage-calculator-example.webp)

### Source

This question is adapted from [FrontendEval's Mortgage Calculator](https://frontendeval.com/questions/mortgage-calculator).

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

- Openai
- Reddit
