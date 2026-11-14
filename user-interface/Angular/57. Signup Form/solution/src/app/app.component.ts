import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <form ngNativeValidate (ngSubmit)="handleSubmit()">
      <label for="username-input">Username</label>
      <input
        id="username-input"
        [(ngModel)]="username"
        minlength="4"
        name="username"
        pattern="^[a-zA-Z0-9]+$"
        required />
      <label for="email-input">Email</label>
      <input
        id="email-input"
        [(ngModel)]="email"
        name="email"
        required
        type="email" />
      <label for="password-input">Password</label>
      <input
        id="password-input"
        [(ngModel)]="password"
        minlength="6"
        name="password"
        required
        type="password" />
      <label for="password-confirm-input">Confirm Password</label>
      <input
        id="password-confirm-input"
        [(ngModel)]="passwordConfirm"
        [attr.aria-describedby]="
          passwordMismatch ? 'password-mismatch-error' : null
        "
        [attr.aria-invalid]="passwordMismatch ? 'true' : null"
        minlength="6"
        name="password_confirm"
        required
        type="password" />
      <div
        *ngIf="passwordMismatch"
        id="password-mismatch-error"
        class="error"
        role="alert">
        The passwords do not match
      </div>
      <button type="submit">Sign Up</button>
    </form>
  `,
  styles: [
    `
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
    `,
  ],
})
export class AppComponent {
  username = '';
  email = '';
  password = '';
  passwordConfirm = '';
  submitted = false;

  get passwordMismatch(): boolean {
    return this.submitted && this.password !== this.passwordConfirm;
  }

  async handleSubmit(): Promise<void> {
    this.submitted = true;
    if (this.passwordMismatch) return;

    try {
      const response = await fetch(
        'https://questions.greatfrontend.com/api/questions/sign-up',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: this.username,
            email: this.email,
            password: this.password,
            password_confirm: this.passwordConfirm,
          }),
        },
      );
      const { message } = await response.json();
      alert(message);
    } catch {
      alert('Error submitting form!');
    }
  }
}
