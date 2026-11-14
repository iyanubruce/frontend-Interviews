import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="wrapper">
      <div><button type="button" (click)="add()">Add</button></div>
      <div class="bars">
        <div *ngFor="let id of bars" class="bar">
          <div class="bar__fill"></div>
        </div>
      </div>
    </div>
  `,
})
export class AppComponent {
  bars: number[] = [];
  private nextId = 0;

  add(): void {
    this.bars = [...this.bars, this.nextId++];
  }
}
