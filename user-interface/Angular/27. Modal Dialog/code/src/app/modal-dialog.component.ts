import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-modal-dialog',
  template: `
    <div>
      <h1>{{ title }}</h1>
      <ng-content></ng-content>
    </div>
  `,
})
export class ModalDialogComponent {
  @Input() title = '';
}
