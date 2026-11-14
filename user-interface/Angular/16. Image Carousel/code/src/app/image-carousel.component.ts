import { Component, Input } from '@angular/core';

interface CarouselImage {
  src: string;
  alt: string;
}

@Component({
  selector: 'app-image-carousel',
  template: `
    <div>
      <img
        *ngFor="let image of images"
        [src]="image.src"
        [alt]="image.alt"
        width="100%" />
    </div>
  `,
})
export class ImageCarouselComponent {
  @Input() images: ReadonlyArray<CarouselImage> = [];
}
