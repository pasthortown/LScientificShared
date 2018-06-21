import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { AceEditorModule } from 'ng2-ace-editor';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    AceEditorModule,
    PdfViewerModule,
    FormsModule,
    NgbModule,
    MainRoutingModule
  ],
  declarations: [MainComponent]
})
export class MainModule { }
