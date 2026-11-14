<script>
  async function submitForm(username, email, password, passwordConfirm) {
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
  }
</script>

<form>
  <label for="username-input">Username</label>
  <input id="username-input" name="username" />
  <button type="submit">Sign Up</button>
</form>
