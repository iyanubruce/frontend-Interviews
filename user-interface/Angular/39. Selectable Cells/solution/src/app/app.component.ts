import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';

interface Point {
  x: number;
  y: number;
}

@Component({
  selector: 'app-root',
  template: `
    <div #dragArea class="draggable-area">
      <div #selectionBox class="select-box" aria-hidden="true"></div>
      <div
        class="grid"
        role="grid"
        aria-label="Selectable cells"
        [style.grid-template-columns]="'repeat(' + columns + ', 1fr)'"
        [style.grid-template-rows]="'repeat(' + rows + ', 1fr)'">
        <div
          *ngFor="let cell of cells"
          class="grid__cell"
          [class.grid__cell--selected]="selectedCells.has(cell)"
          role="gridcell"
          [attr.aria-selected]="selectedCells.has(cell)"></div>
      </div>
    </div>
  `,
})
export class AppComponent {
  readonly rows = 10;
  readonly columns = 10;
  readonly cells = Array.from(
    { length: this.rows * this.columns },
    (_, index) => index,
  );

  dragOrigin: Point | null = null;
  selectedCells = new Set<number>();

  @ViewChild('dragArea', { static: true })
  dragArea!: ElementRef<HTMLElement>;

  @ViewChild('selectionBox', { static: true })
  selectionBox!: ElementRef<HTMLElement>;

  private overlaps(a: DOMRect, b: DOMRect): boolean {
    return (
      a.left < b.right &&
      a.right > b.left &&
      a.top < b.bottom &&
      a.bottom > b.top
    );
  }

  @HostListener('window:mousedown', ['$event'])
  handleMouseDown(event: MouseEvent): void {
    if (event.button !== 0) return;
    this.dragOrigin = { x: event.pageX, y: event.pageY };
    this.selectedCells = new Set<number>();
    this.selectionBox.nativeElement.style.display = 'block';
  }

  @HostListener('window:mousemove', ['$event'])
  handleMouseMove(event: MouseEvent): void {
    if (this.dragOrigin == null) return;

    const box = this.selectionBox.nativeElement;
    box.style.left = Math.min(event.pageX, this.dragOrigin.x) + 'px';
    box.style.top = Math.min(event.pageY, this.dragOrigin.y) + 'px';
    box.style.width = Math.abs(event.pageX - this.dragOrigin.x) + 'px';
    box.style.height = Math.abs(event.pageY - this.dragOrigin.y) + 'px';

    const boxRect = box.getBoundingClientRect();
    const next = new Set<number>();
    this.dragArea.nativeElement
      .querySelectorAll<HTMLElement>('.grid__cell')
      .forEach((cell, index) => {
        if (this.overlaps(boxRect, cell.getBoundingClientRect())) {
          next.add(index);
        }
      });
    this.selectedCells = next;
  }

  @HostListener('window:mouseup')
  handleMouseUp(): void {
    this.dragOrigin = null;
    this.selectionBox.nativeElement.removeAttribute('style');
  }
}
