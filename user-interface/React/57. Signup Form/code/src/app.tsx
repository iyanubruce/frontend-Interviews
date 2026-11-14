async function submitForm(
  username: string,
  email: string,
  password: string,
  passwordConfirm: string,
) {
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

  const { message }: { message: string } = await response.json();
  alert(message);
}

export default function App() {
  return (
    <form>
      <label htmlFor="username-input">Username</label>
      <input id="username-input" name="username" />
      <button type="submit">Sign Up</button>
    </form>
  );
}
