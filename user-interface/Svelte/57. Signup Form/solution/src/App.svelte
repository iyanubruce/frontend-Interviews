<script>
  let username = '';
  let email = '';
  let password = '';
  let passwordConfirm = '';
  let submitted = false;
  $: passwordMismatch = submitted && password !== passwordConfirm;

  async function submitForm() {
    try {
      const response = await fetch(
        'https://questions.greatfrontend.com/api/questions/sign-up',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username,
            email,
            password,
            password_confirm: passwordConfirm,
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
    submitted = true;
    if (password !== passwordConfirm) return;
    await submitForm();
  }
</script>

<form on:submit|preventDefault={handleSubmit}>
  <label for="username-input">Username</label>
  <input
    bind:value={username}
    id="username-input"
    minlength="4"
    name="username"
    pattern="^[a-zA-Z0-9]+$"
    required />

  <label for="email-input">Email</label>
  <input bind:value={email} id="email-input" name="email" required type="email" />

  <label for="password-input">Password</label>
  <input
    bind:value={password}
    id="password-input"
    minlength="6"
    name="password"
    required
    type="password" />

  <label for="password-confirm-input">Confirm Password</label>
  <input
    aria-describedby={passwordMismatch ? 'password-mismatch-error' : undefined}
    aria-invalid={passwordMismatch || undefined}
    bind:value={passwordConfirm}
    id="password-confirm-input"
    minlength="6"
    name="password_confirm"
    required
    type="password" />
  {#if passwordMismatch}
    <div class="error" id="password-mismatch-error" role="alert">The passwords do not match</div>
  {/if}

  <button type="submit">Sign Up</button>
</form>

<style>
  form { display: flex; flex-direction: column; row-gap: 12px; }
  label { font-size: 12px; }
  input { display: block; }
  input:focus { outline: 2px solid royalblue; }
  .error { color: red; font-size: 11px; }
</style>
