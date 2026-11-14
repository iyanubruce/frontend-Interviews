# Contact Form

**Difficulty:** Easy · **Duration:** ~15 min · **Topics:** A11y, Forms

> Source: [contact-form](https://www.greatfrontend.com/questions/user-interface/contact-form/angular)

## Description

Building forms is a common task in front-end development. In this exercise, we will build a basic "Contact Us" form, commonly seen on marketing websites for visitors to ask questions or provide feedback.

### Requirements

- The form should contain the following elements:
  - Name field.
  - Email field.
  - Message field. Since the message can be long, a `<textarea>` will be more suitable.
  - Submit button.
    - Contains the text "Send".
    - Clicking the submit button submits the form.
- Implement the form entirely in HTML. Keep the supplied submission helper; it handles the request and displays the response. Do not add JavaScript or framework-specific form logic.
- There is no need to do any client-side validation on the fields. Validation will be done on the server side.

### Submission API

The supplied helper reads the form fields and sends a JSON `POST` request to `https://questions.greatfrontend.com/api/questions/contact-form` with the following fields in the **request body**: `name`, `email`, `message`.

If all the form fields are correctly filled in, you will see an alert containing a success message. Congratulations!

### Notes

You only need to write HTML for this question. Focus on form controls, labels, field names, and submission attributes.

## Project structure

```
├── src
│   ├── app
│   │   ├── app.component.css
│   │   ├── app.component.html
│   │   ├── app.component.ts
│   │   ├── app.module.ts
│   │   └── submitForm.ts
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

- Lyft
- Amazon
- Openai
- Reddit
- Stripe
- Paypal

## Next questions

- [Signup Form](../57.%20Signup%20Form/question.md) – Medium

## Similar questions

- [Signup Form](../57.%20Signup%20Form/question.md) – Medium
