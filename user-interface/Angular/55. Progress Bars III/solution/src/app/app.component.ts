import { Component } from '@angular/core';

type BarStatus = 'waiting' | 'running' | 'complete';

interface Bar {
  id: number;
  status: BarStatus;
}

@Component({
  selector: 'app-root',
  template: `
    <div class="wrapper">
      <div><button type="button" (click)="add()">Add</button></div>
      <div class="bars">
        <div *ngFor="let bar of bars; trackBy: trackById" class="bar">
          <div
            class="bar__fill"
            [class.bar__fill--running]="bar.status === 'running'"
            [class.bar__fill--complete]="bar.status === 'complete'"
            (animationend)="complete(bar)"></div>
        </div>
      </div>
    </div>
  `,
})
export class AppComponent {
  readonly concurrencyLimit = 3;
  bars: Bar[] = [];
  private nextId = 0;

  add(): void {
    const running = this.bars.filter((bar) => bar.status === 'running').length;
    this.bars = [
      ...this.bars,
      {
        id: this.nextId++,
        status: running < this.concurrencyLimit ? 'running' : 'waiting',
      },
    ];
  }

  complete(bar: Bar): void {
    if (bar.status !== 'running') return;
    bar.status = 'complete';
    this.promoteWaitingBars();
  }

  private promoteWaitingBars(): void {
    while (
      this.bars.filter((bar) => bar.status === 'running').length <
      this.concurrencyLimit
    ) {
      const waiting = this.bars.find((bar) => bar.status === 'waiting');
      if (!waiting) return;
      waiting.status = 'running';
    }
  }

  trackById(_index: number, bar: Bar): number {
    return bar.id;
  }
}
