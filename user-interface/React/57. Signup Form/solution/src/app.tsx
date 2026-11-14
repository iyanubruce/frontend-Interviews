import { useState } from 'react';

async function submitForm(
  username: string,
  email: string,
  password: string,
  passwordConfirm: string,
) {
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

    const { message }: { message: string } = await response.json();
    alert(message);
  } catch {
    alert('Error submitting form!');
  }
}

export default function App() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const passwordMismatch = submitted && password !== passwordConfirm;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);

    if (password !== passwordConfirm) {
      return;
    }

    await submitForm(username, email, password, passwordConfirm);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="username-input">Username</label>
      <input
        id="username-input"
        minLength={4}
        name="username"
        pattern="^[a-zA-Z0-9]+$"
        required
        value={username}
        onChange={(event) => setUsername(event.target.value)}
      />

      <label htmlFor="email-input">Email</label>
      <input
        id="email-input"
        name="email"
        required
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />

      <label htmlFor="password-input">Password</label>
      <input
        id="password-input"
        minLength={6}
        name="password"
        required
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />

      <label htmlFor="password-confirm-input">Confirm Password</label>
      <input
        aria-describedby={
          passwordMismatch ? 'password-mismatch-error' : undefined
        }
        aria-invalid={passwordMismatch || undefined}
        id="password-confirm-input"
        minLength={6}
        name="password_confirm"
        required
        type="password"
        value={passwordConfirm}
        onChange={(event) => setPasswordConfirm(event.target.value)}
      />
      {passwordMismatch ? (
        <div className="error" id="password-mismatch-error" role="alert">
          The passwords do not match
        </div>
      ) : null}

      <button type="submit">Sign Up</button>
    </form>
  );
}
