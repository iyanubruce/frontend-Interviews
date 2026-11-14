import AuthCodeInput from './auth-code-input';

export default function App() {
  return (
    <AuthCodeInput
      onSubmit={async (code) => {
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
      }}
    />
  );
}
