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
    <div
      #overlay
      class="modal-overlay"
      (mousedown)="onOverlayEvent($event)"
      (touchstart)="onOverlayEvent($event)">
      <div
        #dialog
        class="modal"
        role="dialog"
        aria-modal="true"
        [attr.aria-labelledby]="titleId"
        [attr.aria-describedby]="contentId"
        tabindex="-1">
        <h1 class="modal-title" [id]="titleId">
          {{ title }}
        </h1>
        <div [id]="contentId">
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
    this.triggerElement =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    document.body.appendChild(this.overlayElement.nativeElement);
    (this.getTabbableElements()[0] ?? this.dialogElement.nativeElement).focus();
  }

  ngOnDestroy() {
    this.overlayElement.nativeElement.remove();
    this.triggerElement?.focus();
  }

  onOverlayEvent(event: Event) {
    if (event.target === event.currentTarget) {
      this.close.emit();
    }
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.close.emit();
      return;
    }

    if (event.key !== 'Tab') {
      return;
    }

    const elements = this.getTabbableElements();
    if (elements.length === 0) {
      event.preventDefault();
      this.dialogElement.nativeElement.focus();
      return;
    }

    const firstElement = elements[0];
    const lastElement = elements[elements.length - 1];

    if (elements.length === 1) {
      event.preventDefault();
      firstElement.focus();
      return;
    }

    if (
      (event.shiftKey && document.activeElement === firstElement) ||
      (!event.shiftKey && document.activeElement === lastElement)
    ) {
      event.preventDefault();
      (event.shiftKey ? lastElement : firstElement)?.focus();
    }
  }

  private getTabbableElements(): Array<HTMLElement> {
    return Array.from(
      this.dialogElement.nativeElement.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]',
      ),
    ).filter((element) => {
      const { visibility } = window.getComputedStyle(element);
      return (
        !element.matches(':disabled') &&
        element.getAttribute('aria-disabled') !== 'true' &&
        element.closest('[aria-hidden="true"]') == null &&
        element.tabIndex >= 0 &&
        visibility !== 'hidden' &&
        visibility !== 'collapse' &&
        element.getClientRects().length > 0
      );
    });
  }
}
