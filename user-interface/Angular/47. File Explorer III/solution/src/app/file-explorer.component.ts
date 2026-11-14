import { Component, Input } from '@angular/core';

import { FileData } from '../data';

interface FileRow {
  file: FileData;
  level: number;
  path: string;
}

@Component({
  selector: 'app-file-explorer',
  templateUrl: './file-explorer.component.html',
})
export class FileExplorerComponent {
  @Input() data: Array<FileData> = [];

  readonly expandedPaths = new Set<string>();

  get rows(): Array<FileRow> {
    return this.flatten(this.data, 1, 'root');
  }

  trackByPath(_index: number, row: FileRow): string {
    return row.path;
  }

  isDirectory(file: FileData): boolean {
    return Array.isArray(file.children);
  }

  isExpanded(path: string): boolean {
    return this.expandedPaths.has(path);
  }

  toggle(row: FileRow): void {
    if (!this.isDirectory(row.file)) {
      return;
    }

    if (this.expandedPaths.has(row.path)) {
      this.expandedPaths.delete(row.path);
    } else {
      this.expandedPaths.add(row.path);
    }
  }

  private flatten(
    items: Array<FileData>,
    level: number,
    parentPath: string,
  ): Array<FileRow> {
    const rows: Array<FileRow> = [];
    this.sortItems(items).forEach((file, index) => {
      const path = parentPath + '-' + index;
      rows.push({ file, level, path });
      if (this.isDirectory(file) && this.expandedPaths.has(path)) {
        rows.push(...this.flatten(file.children ?? [], level + 1, path));
      }
    });
    return rows;
  }

  private sortItems(items: Array<FileData>): Array<FileData> {
    const directories = items
      .filter((item) => this.isDirectory(item))
      .sort((a, b) => a.name.localeCompare(b.name));
    const files = items
      .filter((item) => !this.isDirectory(item))
      .sort((a, b) => a.name.localeCompare(b.name));
    return [...directories, ...files];
  }
}
