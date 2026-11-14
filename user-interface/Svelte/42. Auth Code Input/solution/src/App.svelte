<script>
  import { onMount, tick } from 'svelte';

  const LENGTH = 6;
  let code = Array(LENGTH).fill('');
  let inputs = [];
  let isSubmitting = false;

  const clampIndex = (index) => Math.max(0, Math.min(index, LENGTH - 1));

  async function focusInput(index) {
    await tick();
    const input = inputs[clampIndex(index)];
    input?.focus();
    input?.select();
  }

  function handleKeydown(event, index) {
    if (isSubmitting) return;

    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      focusInput(index + (event.key === 'ArrowLeft' ? -1 : 1));
      return;
    }

    if (event.key === 'Backspace') {
      event.preventDefault();
      const next = code.slice();
      if (next[index] !== '') {
        next[index] = '';
      } else if (index > 0) {
        next[index - 1] = '';
        focusInput(index - 1);
      }
      code = next;
      return;
    }

    if (/^\d$/.test(event.key)) {
      event.preventDefault();
      const next = code.slice();
      next[index] = event.key;
      code = next;
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
      event.currentTarget.value = code[index];
      return;
    }

    const next = code.slice();
    next[index] = value;
    code = next;
    if (value !== '') {
      focusInput(index + 1);
    }
  }

  function handlePaste(event) {
    event.preventDefault();
    const pasted = event.clipboardData.getData('text');
    if (!/^\d+$/.test(pasted)) return;

    const next = Array(LENGTH).fill('');
    pasted.slice(0, LENGTH).split('').forEach((digit, index) => {
      next[index] = digit;
    });
    code = next;
    focusInput(Math.min(pasted.length, LENGTH - 1));
  }

  function reset() {
    if (isSubmitting) return;
    code = Array(LENGTH).fill('');
    focusInput(0);
  }

  async function submit() {
    if (isSubmitting || code.some((digit) => digit === '')) return;
    isSubmitting = true;
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
    } catch {
      alert('Something went wrong. Please try again later.');
    } finally {
      isSubmitting = false;
    }
  }

  $: canReset = code.some(Boolean);
  $: canSubmit = code.every(Boolean);

  onMount(() => focusInput(0));
</script>

<div class="wrapper">
  <form
    class="container"
    on:reset|preventDefault={reset}
    on:submit|preventDefault={submit}>
    <div class="digits" aria-label="Authorization code">
      {#each code as digit, index}
        <input
          bind:this={inputs[index]}
          class="input-box"
          type="text"
          inputmode="numeric"
          autocomplete={index === 0 ? 'one-time-code' : 'off'}
          maxlength="1"
          aria-label="Digit {index + 1} of {LENGTH}"
          value={digit}
          disabled={isSubmitting}
          on:focus={(event) => event.currentTarget.select()}
          on:input={(event) => handleInput(event, index)}
          on:keydown={(event) => handleKeydown(event, index)}
          on:paste={handlePaste}
        />
      {/each}
    </div>
    <div class="actions">
      <button
        class="button button--secondary"
        type="reset"
        disabled={!canReset || isSubmitting}>Reset</button>
      <button
        class="button button--primary"
        type="submit"
        disabled={!canSubmit || isSubmitting}>Submit</button>
    </div>
  </form>
</div>
