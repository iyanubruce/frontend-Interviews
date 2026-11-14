<script setup>
import { computed, nextTick, onMounted, ref } from 'vue';

const LENGTH = 6;
const code = ref(Array(LENGTH).fill(''));
const digitInputs = ref([]);
const isSubmitting = ref(false);

const canReset = computed(() => code.value.some(Boolean));
const canSubmit = computed(() => code.value.every(Boolean));
const clampIndex = (index) => Math.max(0, Math.min(index, LENGTH - 1));

async function focusInput(index) {
  await nextTick();
  const input = digitInputs.value[clampIndex(index)];
  input?.focus();
  input?.select();
}

function handleKeydown(event, index) {
  if (isSubmitting.value) return;

  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    focusInput(index + (event.key === 'ArrowLeft' ? -1 : 1));
    return;
  }

  if (event.key === 'Backspace') {
    event.preventDefault();
    const next = code.value.slice();
    if (next[index] !== '') {
      next[index] = '';
    } else if (index > 0) {
      next[index - 1] = '';
      focusInput(index - 1);
    }
    code.value = next;
    return;
  }

  if (/^\d$/.test(event.key)) {
    event.preventDefault();
    const next = code.value.slice();
    next[index] = event.key;
    code.value = next;
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
}

function handleInput(event, index) {
  const value = event.currentTarget.value;
  if (value !== '' && !/^\d$/.test(value)) {
    event.currentTarget.value = code.value[index];
    return;
  }

  const next = code.value.slice();
  next[index] = value;
  code.value = next;
  if (value !== '') {
    focusInput(index + 1);
  }
}

function handlePaste(event) {
  const pasted = event.clipboardData.getData('text');
  if (!/^\d+$/.test(pasted)) return;

  const next = Array(LENGTH).fill('');
  pasted
    .slice(0, LENGTH)
    .split('')
    .forEach((digit, index) => {
      next[index] = digit;
    });
  code.value = next;
  focusInput(Math.min(pasted.length, LENGTH - 1));
}

function reset() {
  if (isSubmitting.value) return;
  code.value = Array(LENGTH).fill('');
  focusInput(0);
}

async function submit() {
  if (isSubmitting.value || !canSubmit.value) return;
  isSubmitting.value = true;
  try {
    const response = await fetch(
      'https://questions.greatfrontend.com/api/questions/auth-code-input',
      {
        method: 'POST',
        body: JSON.stringify({ otp: code.value.join('') }),
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
  } catch {
    alert('Something went wrong. Please try again later.');
  } finally {
    isSubmitting.value = false;
  }
}

onMounted(() => focusInput(0));
</script>

<template>
  <div class="wrapper">
    <form class="container" @reset.prevent="reset" @submit.prevent="submit">
      <div class="digits" aria-label="Authorization code">
        <input
          v-for="(digit, index) in code"
          :key="index"
          :ref="(element) => (digitInputs[index] = element)"
          class="input-box"
          type="text"
          inputmode="numeric"
          :autocomplete="index === 0 ? 'one-time-code' : 'off'"
          maxlength="1"
          :aria-label="`Digit ${index + 1} of ${LENGTH}`"
          :value="digit"
          :disabled="isSubmitting"
          @focus="$event.currentTarget.select()"
          @input="handleInput($event, index)"
          @keydown="handleKeydown($event, index)"
          @paste.prevent="handlePaste" />
      </div>
      <div class="actions">
        <button
          class="button button--secondary"
          type="reset"
          :disabled="!canReset || isSubmitting">
          Reset
        </button>
        <button
          class="button button--primary"
          type="submit"
          :disabled="!canSubmit || isSubmitting">
          Submit
        </button>
      </div>
    </form>
  </div>
</template>
