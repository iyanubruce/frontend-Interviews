import FileList from './file-list';
import type { FileData } from './file-explorer-types';

export type { FileData } from './file-explorer-types';

export default function FileExplorer({
  data,
}: Readonly<{ data: ReadonlyArray<FileData> }>) {
  return (
    <div>
      <FileList fileList={data} level={1} />
    </div>
  );
}
