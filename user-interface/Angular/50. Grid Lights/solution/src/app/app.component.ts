import { Component, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnDestroy {
  config = [
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1],
  ];

  flattenedConfig = this.config.flat();

  order: number[] = [];
  isDeactivating = false;
  timerId: number | null = null;

  handleClick(index: number) {
    const newOrder = [...this.order, index];
    this.order = newOrder;

    if (newOrder.length === this.flattenedConfig.filter(Boolean).length) {
      this.deactivateCells();
    }
  }

  deactivateCells() {
    this.isDeactivating = true;
    this.timerId = window.setInterval(() => {
      const newOrder = this.order.slice();
      newOrder.pop();

      if (newOrder.length === 0) {
        this.stopDeactivation();
      }

      this.order = newOrder;
    }, 300);
  }

  stopDeactivation() {
    if (this.timerId != null) {
      window.clearInterval(this.timerId);
      this.timerId = null;
    }
    this.isDeactivating = false;
  }

  ngOnDestroy() {
    this.stopDeactivation();
  }
}
