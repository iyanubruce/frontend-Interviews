# Signup Form

**Difficulty:** Medium · **Duration:** ~30 min · **Topics:** A11y, Forms

> Source: [signup-form](https://www.greatfrontend.com/questions/user-interface/signup-form/vanilla)

## Description

Building robust forms is one of the core skills that a frontend developer should have. One of the most common forms people encounter every day is a signup form.

Implement a signup form to allow users to fill in their details and submit the form.

### Requirements

The form should contain the following elements with the following criteria:

- Username field
  - Minimum of 4 characters.
  - Alphanumeric only.
- Email field
  - Valid email format. Reasonable validation will suffice; you don't have to strictly follow any specification.
- Password field
  - Minimum of 6 characters.
- Confirm password field
  - Must match the password field.
- Submit button
  - Contains the text "Sign Up".
  - Clicking the submit button submits the form.

You are free to decide when (during typing/after blur/upon submission) and how (native HTML validation or custom validation) to validate the form. If the validation fails, show the relevant errors near (beside or below) the corresponding `<input>` fields.

Associate every input with a visible label, preserve a visible focus indicator, and programmatically connect custom error messages to their corresponding fields.

### Submission API

A `submitForm` function has been implemented for you in `index.js`, which makes an AJAX `POST` request to a server-side API that validates the fields using the same criteria. You can use it to verify that your form is not allowing invalid input.

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

- Lyft
- Toptal
- Amazon
- Openai
- Reddit
- Stripe
- Paypal
- Shopify

## Similar questions

- [Contact Form](../04.%20Contact%20Form/question.md) – Easy
