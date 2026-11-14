# Auth Code Input

**Difficulty:** Hard · **Duration:** ~25 min · **Topics:** A11y, Forms

> Source: [auth-code-input](https://www.greatfrontend.com/questions/user-interface/auth-code-input/vanilla)

## Description

Build an auth code input component that allows users to enter a 6-digit authorization code and submit it.

![Auth code input example](https://www.gfecdn.net/img/questions/auth-code-input/auth-code-input-example.webp)

### Requirements

- Entering input
  - Focus the first input field when the component initially loads.
  - Each input field should only allow one digit from 0 to 9.
  - Entering a valid input will move focus to the next input unless it is the last input.
  - <kbd>Tab</kbd> / <kbd>Shift</kbd> + <kbd>Tab</kbd> should follow the normal tab order, while the left/right arrow keys should move focus to the adjacent input field. A newly entered digit should replace an existing digit without requiring an extra deletion.
  - Pressing <kbd>Backspace</kbd> will:
    - Clear the current field if it is not empty.
    - Move focus to the previous field and clear it if the current field is empty.
  - Pasting content that contains only digits should clear all fields and fill them from the first field, up to six digits. Ignore other pasted content.
- Buttons
  - "Submit" button submits the OTP. It is disabled until all the input fields are filled.
  - "Reset" button clears all the fields and focuses the first field. It is disabled if all the input fields are empty.
  - Disable all inputs and buttons while a submission request is in progress.
- Submitting the form should make a `POST` request to `https://questions.greatfrontend.com/api/questions/auth-code-input` with a body of `{ otp: '6_DIGIT_OTP' }`.
  - HTTP 204 is returned if the OTP is `'123456'` (the API is hardcoded to only accept this value).
  - HTTP 403 is returned otherwise.
  - Display a success/failure message depending on the response.

These are just the common basic 2FA behaviors; there are more edge cases to consider, and we won't list them all, as it is good practice for you to think through them on your own.

Here's a [decent auth code input example](https://github.com/drac94/react-auth-code-input).

### Source

This question is adapted from [FrontendEval's Two-factor Code Input question](https://frontendeval.com/questions/code-input).

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

- Apple
- Stripe
