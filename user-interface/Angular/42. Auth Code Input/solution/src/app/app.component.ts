import {
  AfterViewInit,
  Component,
  ElementRef,
  QueryList,
  ViewChildren,
} from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="wrapper">
      <form class="container" (reset)="reset($event)" (submit)="submit($event)">
        <div class="digits" aria-label="Authorization code">
          <input
            #digitInput
            *ngFor="let digit of code; let index = index; trackBy: trackByIndex"
            class="input-box"
            type="text"
            inputmode="numeric"
            maxlength="1"
            [attr.autocomplete]="index === 0 ? 'one-time-code' : 'off'"
            [attr.aria-label]="'Digit ' + (index + 1) + ' of ' + length"
            [value]="digit"
            [disabled]="isSubmitting"
            (focus)="selectInput($event)"
            (input)="handleInput($event, index)"
            (keydown)="handleKeydown($event, index)"
            (paste)="handlePaste($event)" />
        </div>
        <div class="actions">
          <button
            class="button button--secondary"
            type="reset"
            [disabled]="!canReset || isSubmitting">
            Reset
          </button>
          <button
            class="button button--primary"
            type="submit"
            [disabled]="!canSubmit || isSubmitting">
            Submit
          </button>
        </div>
      </form>
    </div>
  `,
})
export class AppComponent implements AfterViewInit {
  readonly length = 6;
  code = Array<string>(this.length).fill('');
  isSubmitting = false;

  @ViewChildren('digitInput')
  digitInputs!: QueryList<ElementRef<HTMLInputElement>>;

  get canReset(): boolean {
    return this.code.some(Boolean);
  }

  get canSubmit(): boolean {
    return this.code.every(Boolean);
  }

  ngAfterViewInit(): void {
    queueMicrotask(() => this.focusInput(0));
  }

  trackByIndex(index: number): number {
    return index;
  }

  private clampIndex(index: number): number {
    return Math.max(0, Math.min(index, this.length - 1));
  }

  private focusInput(index: number): void {
    const input = this.digitInputs.get(this.clampIndex(index))?.nativeElement;
    input?.focus();
    input?.select();
  }

  selectInput(event: FocusEvent): void {
    (event.currentTarget as HTMLInputElement).select();
  }

  handleKeydown(event: KeyboardEvent, index: number): void {
    if (this.isSubmitting) return;

    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      this.focusInput(index + (event.key === 'ArrowLeft' ? -1 : 1));
      return;
    }

    if (event.key === 'Backspace') {
      event.preventDefault();
      const next = this.code.slice();
      if (next[index] !== '') {
        next[index] = '';
      } else if (index > 0) {
        next[index - 1] = '';
        this.focusInput(index - 1);
      }
      this.code = next;
      return;
    }

    if (/^\d$/.test(event.key)) {
      event.preventDefault();
      const next = this.code.slice();
      next[index] = event.key;
      this.code = next;
      this.focusInput(index + 1);
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

  handleInput(event: Event, index: number): void {
    const input = event.currentTarget as HTMLInputElement;
    if (input.value !== '' && !/^\d$/.test(input.value)) {
      input.value = this.code[index];
      return;
    }

    const next = this.code.slice();
    next[index] = input.value;
    this.code = next;
    if (input.value !== '') {
      this.focusInput(index + 1);
    }
  }

  handlePaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pasted = event.clipboardData?.getData('text') ?? '';
    if (!/^\d+$/.test(pasted)) return;

    const next = Array<string>(this.length).fill('');
    pasted
      .slice(0, this.length)
      .split('')
      .forEach((digit, index) => {
        next[index] = digit;
      });
    this.code = next;
    this.focusInput(Math.min(pasted.length, this.length - 1));
  }

  reset(event: Event): void {
    event.preventDefault();
    if (this.isSubmitting) return;
    this.code = Array<string>(this.length).fill('');
    this.focusInput(0);
  }

  async submit(event: Event): Promise<void> {
    event.preventDefault();
    if (this.isSubmitting || !this.canSubmit) return;

    this.isSubmitting = true;
    try {
      const response = await fetch(
        'https://questions.greatfrontend.com/api/questions/auth-code-input',
        {
          method: 'POST',
          body: JSON.stringify({ otp: this.code.join('') }),
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
      this.isSubmitting = false;
    }
  }
}
