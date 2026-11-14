import { FileObject, FileData } from './file-explorer';

export default function FileList({
  fileList,
}: Readonly<{
  fileList: ReadonlyArray<FileData>;
}>) {
  const directories = fileList.filter((fileItem) => fileItem.children);
  directories.sort((a, b) => a.name.localeCompare(b.name));

  const nonDirectories = fileList.filter((fileItem) => !fileItem.children);
  nonDirectories.sort((a, b) => a.name.localeCompare(b.name));

  const items = [...directories, ...nonDirectories];

  return (
    <ul className="file-list">
      {items.map((file) => (
        <FileObject key={file.id} file={file} />
      ))}
    </ul>
  );
}
