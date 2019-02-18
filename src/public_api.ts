import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MarkdownEditorComponent } from './lib/md-editor.component';
import { MarkdownEditorResizeSensorComponent } from './lib/resize-sensor/resize-sensor.component';

export { MarkdownEditorComponent } from './lib/md-editor.component';
export { MarkdownEditorResizeSensorComponent } from './lib/resize-sensor/resize-sensor.component';
export { MdEditorOption, UploadResult, MarkedjsOption } from './lib/md-editor.types';

@NgModule({
  declarations: [
    MarkdownEditorComponent,
    MarkdownEditorResizeSensorComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    MarkdownEditorComponent,
    MarkdownEditorResizeSensorComponent
  ]
})
export class LMarkdownEditorModule { }
