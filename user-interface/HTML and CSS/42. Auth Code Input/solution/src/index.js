import './styles.css';

const LENGTH = 6;
const code = Array(LENGTH).fill('');
let isSubmitting = false;

const app = document.querySelector('#app');
app.innerHTML = `
  <div class="wrapper">
    <form class="container">
      <div class="digits" aria-label="Authorization code"></div>
      <div class="actions">
        <button class="button button--secondary" type="reset">Reset</button>
        <button class="button button--primary" type="submit">Submit</button>
      </div>
    </form>
  </div>
`;

const form = app.querySelector('form');
const digits = app.querySelector('.digits');
const resetButton = app.querySelector('[type="reset"]');
const submitButton = app.querySelector('[type="submit"]');

const inputs = Array.from({ length: LENGTH }, (_, index) => {
  const input = document.createElement('input');
  input.className = 'input-box';
  input.type = 'text';
  input.inputMode = 'numeric';
  input.autocomplete = index === 0 ? 'one-time-code' : 'off';
  input.maxLength = 1;
  input.setAttribute('aria-label', `Digit ${index + 1} of ${LENGTH}`);
  digits.append(input);
  return input;
});

function clampIndex(index) {
  return Math.max(0, Math.min(index, LENGTH - 1));
}

function focusInput(index) {
  inputs[clampIndex(index)].focus();
  inputs[clampIndex(index)].select();
}

function sync() {
  inputs.forEach((input, index) => {
    input.value = code[index];
    input.disabled = isSubmitting;
  });
  resetButton.disabled = isSubmitting || code.every((digit) => digit === '');
  submitButton.disabled = isSubmitting || code.some((digit) => digit === '');
}

inputs.forEach((input, index) => {
  input.addEventListener('focus', () => input.select());

  input.addEventListener('keydown', (event) => {
    if (isSubmitting) return;

    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      focusInput(index + (event.key === 'ArrowLeft' ? -1 : 1));
      return;
    }

    if (event.key === 'Backspace') {
      event.preventDefault();
      if (code[index] !== '') {
        code[index] = '';
        sync();
      } else if (index > 0) {
        code[index - 1] = '';
        sync();
        focusInput(index - 1);
      }
      return;
    }

    if (/^\d$/.test(event.key)) {
      event.preventDefault();
      code[index] = event.key;
      sync();
      focusInput(index + 1);
      return;
    }

    if (
      !event.altKey &&
      !event.ctrlKey &&
      !event.metaKey &&
      (event.key.length === 1 || event.key === 'Delete')
    ) {
      event.preventDefault();
    }
  });

  input.addEventListener('input', () => {
    if (input.value !== '' && !/^\d$/.test(input.value)) {
      input.value = code[index];
      return;
    }

    code[index] = input.value;
    sync();
    if (input.value !== '') focusInput(index + 1);
  });

  input.addEventListener('paste', (event) => {
    event.preventDefault();
    const pasted = event.clipboardData.getData('text');
    if (!/^\d+$/.test(pasted)) return;

    code.fill('');
    pasted
      .slice(0, LENGTH)
      .split('')
      .forEach((digit, digitIndex) => {
        code[digitIndex] = digit;
      });
    sync();
    focusInput(Math.min(pasted.length, LENGTH - 1));
  });
});

form.addEventListener('reset', (event) => {
  event.preventDefault();
  if (isSubmitting) return;
  code.fill('');
  sync();
  focusInput(0);
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (isSubmitting || code.some((digit) => digit === '')) return;

  isSubmitting = true;
  sync();
  try {
    const response = await fetch(
      'https://questions.greatfrontend.com/api/questions/auth-code-input',
      {
        method: 'POST',
        body: JSON.stringify({ otp: code.join('') }),
        headers: { 'Content-Type': 'application/json' },
      },
    );
    if (response.status === 204) {
      alert('Code verified successfully.');
    } else if (response.status === 403) {
      alert('Invalid authorization code.');
    } else {
      alert('Something went wrong. Please try again later.');
    }
  } catch (error) {
    alert('Something went wrong. Please try again later.');
  } finally {
    isSubmitting = false;
    sync();
  }
});

sync();
focusInput(0);
