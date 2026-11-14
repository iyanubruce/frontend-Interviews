import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild,
} from '@angular/core';

interface CarouselImage {
  src: string;
  alt: string;
}

@Component({
  selector: 'app-image-carousel',
  template: `
    <div #carousel class="image-carousel">
      <div
        class="image-carousel__row"
        [class.image-carousel__row--transitioning]="isTransitioning"
        [style.transform]="'translateX(-' + currentIndex * imageWidth + 'px)'"
        (transitionend)="finishTransition()">
        <img
          *ngFor="let image of images"
          class="image-carousel__image"
          [src]="image.src"
          [alt]="image.alt" />
      </div>
      <button
        aria-label="Previous image"
        class="image-carousel__button image-carousel__button--prev"
        [disabled]="isTransitioning"
        (click)="changeIndex(currentIndex - 1)">
        &#10094;
      </button>
      <div class="image-carousel__pages">
        <button
          *ngFor="let image of images; let index = index"
          [attr.aria-label]="'Navigate to ' + image.alt"
          class="image-carousel__pages__button"
          [class.image-carousel__pages__button--active]="index === currentIndex"
          [disabled]="isTransitioning"
          (click)="changeIndex(index)"></button>
      </div>
      <button
        aria-label="Next image"
        class="image-carousel__button image-carousel__button--next"
        [disabled]="isTransitioning"
        (click)="changeIndex(currentIndex + 1)">
        &#10095;
      </button>
    </div>
  `,
})
export class ImageCarouselComponent implements AfterViewInit, OnDestroy {
  @Input() images: ReadonlyArray<CarouselImage> = [];
  @ViewChild('carousel')
  carouselElement!: ElementRef<HTMLDivElement>;

  currentIndex = 0;
  imageWidth = 0;
  isTransitioning = false;

  private readonly updateImageWidth = () => {
    this.imageWidth =
      this.carouselElement.nativeElement.getBoundingClientRect().width;
    this.isTransitioning = false;
  };

  ngAfterViewInit() {
    this.updateImageWidth();
    window.addEventListener('resize', this.updateImageWidth);
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.updateImageWidth);
  }

  changeIndex(index: number) {
    const nextIndex = (index + this.images.length) % this.images.length;
    if (this.isTransitioning || nextIndex === this.currentIndex) {
      return;
    }

    this.currentIndex = nextIndex;
    this.isTransitioning = true;
  }

  finishTransition() {
    this.isTransitioning = false;
  }
}
