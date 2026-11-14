<script setup>
import { computed, ref } from 'vue';

const username = ref('');
const email = ref('');
const password = ref('');
const passwordConfirm = ref('');
const submitted = ref(false);
const passwordMismatch = computed(
  () => submitted.value && password.value !== passwordConfirm.value,
);

async function submitForm() {
  try {
    const response = await fetch(
      'https://questions.greatfrontend.com/api/questions/sign-up',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.value,
          email: email.value,
          password: password.value,
          password_confirm: passwordConfirm.value,
        }),
      },
    );
    const { message } = await response.json();
    alert(message);
  } catch {
    alert('Error submitting form!');
  }
}

async function handleSubmit() {
  submitted.value = true;
  if (!passwordMismatch.value) await submitForm();
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <label for="username-input">Username</label>
    <input
      id="username-input"
      v-model="username"
      minlength="4"
      name="username"
      pattern="^[a-zA-Z0-9]+$"
      required />
    <label for="email-input">Email</label>
    <input
      id="email-input"
      v-model="email"
      name="email"
      required
      type="email" />
    <label for="password-input">Password</label>
    <input
      id="password-input"
      v-model="password"
      minlength="6"
      name="password"
      required
      type="password" />
    <label for="password-confirm-input">Confirm Password</label>
    <input
      id="password-confirm-input"
      v-model="passwordConfirm"
      :aria-describedby="
        passwordMismatch ? 'password-mismatch-error' : undefined
      "
      :aria-invalid="passwordMismatch || undefined"
      minlength="6"
      name="password_confirm"
      required
      type="password" />
    <div
      v-if="passwordMismatch"
      id="password-mismatch-error"
      class="error"
      role="alert">
      The passwords do not match
    </div>
    <button type="submit">Sign Up</button>
  </form>
</template>

<style>
form {
  display: flex;
  flex-direction: column;
  row-gap: 12px;
}
label {
  font-size: 12px;
}
input {
  display: block;
}
input:focus {
  outline: 2px solid royalblue;
}
.error {
  color: red;
  font-size: 11px;
}
</style>
