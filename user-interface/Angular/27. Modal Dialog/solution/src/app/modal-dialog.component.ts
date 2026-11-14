import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';

let nextModalId = 0;

@Component({
  selector: 'app-modal-dialog',
  template: `
    <div #overlay class="modal-overlay">
      <div #dialog class="modal">
        <h1 class="modal-title">
          {{ title }}
        </h1>
        <div>
          <ng-content></ng-content>
        </div>
        <button type="button" (click)="close.emit()">Close</button>
      </div>
    </div>
  `,
})
export class ModalDialogComponent implements AfterViewInit, OnDestroy {
  @Input() title = '';
  @Output() close = new EventEmitter<void>();
  @ViewChild('overlay', { static: true })
  overlayElement!: ElementRef<HTMLDivElement>;
  @ViewChild('dialog', { static: true })
  dialogElement!: ElementRef<HTMLDivElement>;

  readonly modalId = ++nextModalId;
  readonly titleId = 'modal-title-' + this.modalId;
  readonly contentId = 'modal-content-' + this.modalId;
  private triggerElement: HTMLElement | null = null;

  ngAfterViewInit() {
    document.body.appendChild(this.overlayElement.nativeElement);
  }

  ngOnDestroy() {
    this.overlayElement.nativeElement.remove();
  }

  private getTabbableElements(): Array<HTMLElement> {
    return Array.from(
      this.dialogElement.nativeElement.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      ),
    );
  }
}
