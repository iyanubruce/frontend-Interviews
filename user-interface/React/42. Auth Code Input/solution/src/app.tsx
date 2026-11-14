import { useState } from 'react';

import AuthCodeInput from './auth-code-input';

function App() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(code: string) {
    setIsSubmitting(true);
    try {
      const response = await fetch(
        'https://questions.greatfrontend.com/api/questions/auth-code-input',
        {
          method: 'POST',
          body: JSON.stringify({ otp: code }),
          headers: {
            'Content-Type': 'application/json',
          },
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
      setIsSubmitting(false);
    }
  }

  return (
    <AuthCodeInput length={6} onSubmit={onSubmit} isDisabled={isSubmitting} />
  );
}

export default App;
