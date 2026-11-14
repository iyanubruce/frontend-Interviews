import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <form>
      <label for="username-input">Username</label>
      <input id="username-input" name="username" />
      <button type="submit">Sign Up</button>
    </form>
  `,
})
export class AppComponent {
  async submitForm(
    username: string,
    email: string,
    password: string,
    passwordConfirm: string,
  ): Promise<void> {
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
}
