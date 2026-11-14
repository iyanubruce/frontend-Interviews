import { useState } from 'react';
import type { FileData } from './file-explorer-types';

function FileObject({
  file,
  level,
}: Readonly<{
  file: FileData;
  level: number;
}>) {
  const [expanded, setExpanded] = useState(false);
  const { children: fileChildren, name: fileName } = file;
  // If the children field is present, the item is a directory.
  const isDirectory = Boolean(fileChildren);

  return (
    <>
      <li
        className="file-item"
        style={{
          paddingLeft: (level - 1) * 16,
        }}>
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
      </li>
      {fileChildren && fileChildren.length > 0 && expanded && (
        <FileList fileList={fileChildren} level={level + 1} />
      )}
    </>
  );
}

export default function FileList({
  fileList,
  level,
}: Readonly<{
  fileList: ReadonlyArray<FileData>;
  level: number;
}>) {
  const directories = fileList.filter((fileItem) => fileItem.children);
  directories.sort((a, b) => a.name.localeCompare(b.name));

  const nonDirectories = fileList.filter((fileItem) => !fileItem.children);
  nonDirectories.sort((a, b) => a.name.localeCompare(b.name));

  const items = [...directories, ...nonDirectories];

  return (
    <>
      {items.map((file) => (
        <FileObject key={file.id} file={file} level={level} />
      ))}
    </>
  );
}
