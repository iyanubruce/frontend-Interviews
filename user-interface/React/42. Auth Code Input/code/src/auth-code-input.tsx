export default function AuthCodeInput({
  onSubmit,
}: Readonly<{
  onSubmit: (code: string) => void;
}>) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        onSubmit(String(data.get('otp') ?? ''));
      }}>
      <input name="otp" type="text" />
      <button type="reset">Reset</button>
      <button type="submit">Submit</button>
    </form>
  );
}
