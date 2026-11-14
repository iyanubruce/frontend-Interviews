import { useState } from 'react';
import FileList from './file-list';

export type FileData = Readonly<{
  id: number;
  name: string;
  children?: ReadonlyArray<FileData>;
}>;

export default function FileExplorer({
  data,
}: Readonly<{ data: ReadonlyArray<FileData> }>) {
  return (
    <div>
      <FileList fileList={data} />
    </div>
  );
}

export function FileObject({ file }: Readonly<{ file: FileData }>) {
  const [expanded, setExpanded] = useState(false);
  const { children: fileChildren, name: fileName } = file;
  // If the children field is present, the item is a directory.
  const isDirectory = Boolean(fileChildren);

  return (
    <li className="file-item">
      {isDirectory ? (
        <button
          className="file-item-button file-item-button--directory"
          type="button"
          onClick={() => setExpanded(!expanded)}>
          <span>{fileName}</span> [{expanded ? '-' : '+'}]
        </button>
      ) : (
        <span className="file-item-button">{fileName}</span>
      )}
      {fileChildren && fileChildren.length > 0 && expanded && (
        <FileList fileList={fileChildren} />
      )}
    </li>
  );
}
