import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ModalDialogComponent } from './modal-dialog.component';

@NgModule({
  declarations: [AppComponent, ModalDialogComponent],
  imports: [BrowserModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
