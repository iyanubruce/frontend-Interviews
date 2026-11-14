import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { FileExplorerComponent } from './file-explorer.component';

@NgModule({
  declarations: [AppComponent, FileExplorerComponent],
  imports: [BrowserModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
