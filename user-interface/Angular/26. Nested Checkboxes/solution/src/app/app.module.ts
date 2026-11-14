import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent, CheckboxNodeComponent } from './app.component';

@NgModule({
  declarations: [AppComponent, CheckboxNodeComponent],
  imports: [BrowserModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
