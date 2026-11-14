import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ImageCarouselComponent } from './image-carousel.component';

@NgModule({
  declarations: [AppComponent, ImageCarouselComponent],
  imports: [BrowserModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
