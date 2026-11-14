export default function ModalDialog({
  children,
  title,
}: Readonly<{ children: React.ReactNode; title: string }>) {
  return (
    <div>
      <h1>{title}</h1>
      {children}
    </div>
  );
}
