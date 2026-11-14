import { Component, Input } from '@angular/core';

interface CarouselImage {
  src: string;
  alt: string;
}

@Component({
  selector: 'app-image-carousel',
  template: `
    <div class="image-carousel">
      <img
        class="image-carousel__image"
        [class.image-carousel__image--displaced-left]="
          isTransitioning && movesLeft
        "
        [class.image-carousel__image--displaced-right]="
          isTransitioning && !movesLeft
        "
        [src]="currentImage.src"
        [alt]="currentImage.alt" />
      <img
        *ngIf="nextImage as pendingImage"
        class="image-carousel__image"
        [class.image-carousel__image--displaced-right]="
          !isTransitioning && movesLeft
        "
        [class.image-carousel__image--displaced-left]="
          !isTransitioning && !movesLeft
        "
        [src]="pendingImage.src"
        [alt]="pendingImage.alt"
        (transitionend)="finishTransition()" />
      <button
        aria-label="Previous image"
        class="image-carousel__button image-carousel__button--prev"
        [disabled]="nextIndex !== null"
        (click)="changeIndex(currentIndex - 1)">
        &#10094;
      </button>
      <div class="image-carousel__pages">
        <button
          *ngFor="let image of images; let index = index"
          [attr.aria-label]="'Navigate to ' + image.alt"
          class="image-carousel__pages__button"
          [class.image-carousel__pages__button--active]="index === currentIndex"
          [disabled]="nextIndex !== null"
          (click)="changeIndex(index)"></button>
      </div>
      <button
        aria-label="Next image"
        class="image-carousel__button image-carousel__button--next"
        [disabled]="nextIndex !== null"
        (click)="changeIndex(currentIndex + 1)">
        &#10095;
      </button>
    </div>
  `,
})
export class ImageCarouselComponent {
  @Input() images: ReadonlyArray<CarouselImage> = [];

  currentIndex = 0;
  nextIndex: number | null = null;
  isTransitioning = false;

  get currentImage(): CarouselImage {
    return this.images[this.currentIndex];
  }

  get nextImage(): CarouselImage | null {
    return this.nextIndex === null ? null : this.images[this.nextIndex];
  }

  get movesLeft(): boolean {
    if (this.currentIndex === this.images.length - 1 && this.nextIndex === 0) {
      return true;
    }
    if (this.currentIndex === 0 && this.nextIndex === this.images.length - 1) {
      return false;
    }
    return this.nextIndex !== null && this.currentIndex < this.nextIndex;
  }

  changeIndex(index: number) {
    const normalizedIndex = (index + this.images.length) % this.images.length;
    if (this.nextIndex !== null || normalizedIndex === this.currentIndex) {
      return;
    }

    this.nextIndex = normalizedIndex;
    requestAnimationFrame(() => {
      this.isTransitioning = true;
    });
  }

  finishTransition() {
    if (this.nextIndex === null) {
      return;
    }
    this.currentIndex = this.nextIndex;
    this.nextIndex = null;
    this.isTransitioning = false;
  }
}
