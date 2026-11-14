import { useState } from 'react';

type FileData = Readonly<{
  id: number;
  name: string;
  children?: ReadonlyArray<FileData>;
}>;

export default function FileExplorer({
  data,
}: Readonly<{ data: ReadonlyArray<FileData> }>) {
  const [message, setMessage] = useState('Hello world');

  return (
    <div>
      <h1>{message}</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
