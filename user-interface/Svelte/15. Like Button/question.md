# Like Button

**Difficulty:** Medium · **Duration:** ~20 min · **Topics:** Async, Networking

> Source: [like-button](https://www.greatfrontend.com/questions/user-interface/like-button/svelte)

## Description

Create a Like button whose appearance changes based on the following states:

![Like Button States](https://www.gfecdn.net/img/questions/like-button/like-button-states.webp)

The heart and spinner icons are provided for your convenience. The focus of this question is on handling the various states, not on being pixel-perfect. As for colors, you can use `#f00` for the red and `#888` for the gray.

### Requirements

In the button's default state, when it is clicked, it goes into the loading state and a request is made to the provided back end API, which has a 50% chance of succeeding or failing.

- **Success response**: If the request was successful, the button changes to the "Liked" state.
- **Failure response**: Otherwise, it returns to the "Default"/"Hovered" state depending on whether the cursor is still over the button. The error message from the back end API should be shown below the button.

If the user clicks on a button in the "Liked" state, the reverse happens.

The visible button label should remain "Like" in every state. Set `aria-pressed` to `false` in the default state and `true` in the liked state.

### Submission API

- URL: `https://questions.greatfrontend.com/api/questions/like-button`
- HTTP Method: `POST`
- Content Type: `json`

#### Parameters

The following fields are accepted in the **request body**:

- `action`: A string of either `'like'` or `'unlike'` depending on the desired action.

#### Response

The API has a 50% chance of succeeding (HTTP 200) or failing (HTTP 500), so as to make it easy for you to test the request failure cases. It returns a JSON payload of the following shape depending on the outcome.

- **Success**: `{ message: 'Success!' }`
- **Failure**: `{ message: 'Error during attempted {{action}}. Please try again later.' }`

## Project structure

```
├── public
│   └── index.html
├── src
│   ├── App.svelte
│   ├── HeartIcon.svelte
│   ├── index.js
│   ├── SpinnerIcon.svelte
│   └── styles.css
└── package.json
```

- `code/` – starter files for the question.
- `solution/` – reference solution files.

## Asked at these companies

- Amazon
- Openai
- Coinbase
