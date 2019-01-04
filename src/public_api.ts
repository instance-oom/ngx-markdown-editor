import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MarkdownEditorComponent } from './lib/md-editor.component';

export { MarkdownEditorComponent } from './lib/md-editor.component';
export { MdEditorOption, UploadResult } from './lib/md-editor.types';

@NgModule({
  declarations: [
    MarkdownEditorComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    MarkdownEditorComponent
  ]
})
export class LMarkdownEditorModule { }
