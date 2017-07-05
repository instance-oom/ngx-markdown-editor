import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MarkdownEditorComponent } from './md-editor/md-editor.component';

export * from './md-editor/md-editor.component';

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
