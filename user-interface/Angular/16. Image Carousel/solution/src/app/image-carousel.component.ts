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
        [src]="currentImage.src"
        [alt]="currentImage.alt" />
      <button
        aria-label="Previous image"
        class="image-carousel__button image-carousel__button--prev"
        (click)="changeIndex(currentIndex - 1)">
        &#10094;
      </button>
      <div class="image-carousel__pages">
        <button
          *ngFor="let image of images; let index = index"
          [attr.aria-label]="'Navigate to ' + image.alt"
          class="image-carousel__pages__button"
          [class.image-carousel__pages__button--active]="index === currentIndex"
          (click)="changeIndex(index)"></button>
      </div>
      <button
        aria-label="Next image"
        class="image-carousel__button image-carousel__button--next"
        (click)="changeIndex(currentIndex + 1)">
        &#10095;
      </button>
    </div>
  `,
})
export class ImageCarouselComponent {
  @Input() images: ReadonlyArray<CarouselImage> = [];

  currentIndex = 0;

  get currentImage(): CarouselImage {
    return this.images[this.currentIndex];
  }

  changeIndex(index: number) {
    this.currentIndex = (index + this.images.length) % this.images.length;
  }
}
