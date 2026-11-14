import { Component, Input } from '@angular/core';

import { FileData } from '../data';

@Component({
  selector: 'app-file-explorer',
  templateUrl: './file-explorer.component.html',
})
export class FileExplorerComponent {
  @Input() data: Array<FileData> = [];
  @Input() level = 1;
  @Input() path = 'root';

  readonly expandedPaths = new Set<string>();

  get items(): Array<FileData> {
    return this.sortItems(this.data);
  }

  isDirectory(file: FileData): boolean {
    return Array.isArray(file.children);
  }

  itemPath(index: number): string {
    return this.path + '-' + index;
  }

  isExpanded(index: number): boolean {
    return this.expandedPaths.has(this.itemPath(index));
  }

  toggle(file: FileData, index: number): void {
    if (!this.isDirectory(file)) {
      return;
    }

    const path = this.itemPath(index);
    if (this.expandedPaths.has(path)) {
      this.expandedPaths.delete(path);
    } else {
      this.expandedPaths.add(path);
    }
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
