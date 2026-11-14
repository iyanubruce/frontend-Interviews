import { Component, EventEmitter, Input, Output } from '@angular/core';

type CheckboxState = boolean | 'indeterminate';

interface CheckboxItem {
  id: number;
  name: string;
  checked: CheckboxState;
  children?: CheckboxItem[];
}

interface ToggleEvent {
  checked: boolean;
  path: number[];
}

@Component({
  selector: 'app-checkbox-node',
  template: `
    <li>
      <label class="checkbox">
        <input
          type="checkbox"
          [checked]="item.checked === true"
          [indeterminate]="item.checked === 'indeterminate'"
          (change)="toggle($event)" />
        {{ item.name }}
      </label>

      <ul *ngIf="item.children?.length">
        <app-checkbox-node
          *ngFor="
            let child of item.children;
            let index = index;
            trackBy: trackById
          "
          [item]="child"
          (toggled)="forwardToggle($event, index)" />
      </ul>
    </li>
  `,
})
export class CheckboxNodeComponent {
  @Input({ required: true }) item!: CheckboxItem;
  @Output() toggled = new EventEmitter<ToggleEvent>();

  trackById(_index: number, item: CheckboxItem): number {
    return item.id;
  }

  toggle(event: Event): void {
    this.toggled.emit({
      checked: (event.currentTarget as HTMLInputElement).checked,
      path: [],
    });
  }

  forwardToggle(event: ToggleEvent, index: number): void {
    this.toggled.emit({
      checked: event.checked,
      path: [index, ...event.path],
    });
  }
}

@Component({
  selector: 'app-root',
  template: `
    <ul>
      <app-checkbox-node
        *ngFor="let item of checkboxData; let index = index; trackBy: trackById"
        [item]="item"
        (toggled)="handleRootToggle($event, index)" />
    </ul>
  `,
})
export class AppComponent {
  checkboxData: CheckboxItem[] = [
    {
      id: 1,
      name: 'Electronics',
      checked: false,
      children: [
        {
          id: 2,
          name: 'Mobile phones',
          checked: false,
          children: [
            { id: 3, name: 'iPhone', checked: false },
            { id: 4, name: 'Android', checked: false },
          ],
        },
        {
          id: 5,
          name: 'Laptops',
          checked: false,
          children: [
            { id: 6, name: 'MacBook', checked: false },
            { id: 7, name: 'Surface Pro', checked: false },
          ],
        },
      ],
    },
    {
      id: 8,
      name: 'Books',
      checked: false,
      children: [
        { id: 9, name: 'Fiction', checked: false },
        { id: 10, name: 'Non-fiction', checked: false },
      ],
    },
    { id: 11, name: 'Toys', checked: false },
  ];

  trackById(_index: number, item: CheckboxItem): number {
    return item.id;
  }

  private updateDescendants(item: CheckboxItem, checked: boolean): void {
    item.checked = checked;
    item.children?.forEach((child) => this.updateDescendants(child, checked));
  }

  private resolveStates(items: CheckboxItem[]): void {
    items.forEach((item) => {
      if (!item.children?.length) return;
      this.resolveStates(item.children);

      if (item.children.every((child) => child.checked === true)) {
        item.checked = true;
      } else if (item.children.every((child) => child.checked === false)) {
        item.checked = false;
      } else {
        item.checked = 'indeterminate';
      }
    });
  }

  handleToggle(event: ToggleEvent): void {
    const next = JSON.parse(
      JSON.stringify(this.checkboxData),
    ) as CheckboxItem[];
    let item = next[event.path[0]];

    for (const index of event.path.slice(1)) {
      item = item.children![index];
    }

    this.updateDescendants(item, event.checked);
    this.resolveStates(next);
    this.checkboxData = next;
  }

  handleRootToggle(event: ToggleEvent, index: number): void {
    this.handleToggle({
      checked: event.checked,
      path: [index, ...event.path],
    });
  }
}
