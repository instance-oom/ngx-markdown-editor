import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MarkdownEditorComponent } from './md-editor/md-editor.component';

export { MarkdownEditorComponent } from './md-editor/md-editor.component';
export { MdEditorOption } from './md-editor/md-editor';

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
