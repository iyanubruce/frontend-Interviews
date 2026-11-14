import { Component, Input } from '@angular/core';

import { FileData } from '../data';

@Component({
  selector: 'app-file-explorer',
  templateUrl: './file-explorer.component.html',
})
export class FileExplorerComponent {
  @Input() data: Array<FileData> = [];

  get items(): Array<FileData> {
    return this.sortItems(this.data);
  }

  private sortItems(items: Array<FileData>): Array<FileData> {
    return items.slice().sort((a, b) => {
      const directoryOrder =
        Number(!Array.isArray(a.children)) - Number(!Array.isArray(b.children));
      return directoryOrder || a.name.localeCompare(b.name);
    });
  }
}
