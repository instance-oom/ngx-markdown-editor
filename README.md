# ngx-markdown-editor
Angular markdown editor based on ace editor

[![peerDependencies Status](https://david-dm.org/lon-yang/ngx-markdown-editor/peer-status.svg)](https://david-dm.org/lon-yang/ngx-markdown-editor?type=peer)
[![npm version](https://badge.fury.io/js/ngx-markdown-editor.svg)](https://badge.fury.io/js/ngx-markdown-editor)
[![licence](https://img.shields.io/npm/l/ngx-markdown-editor.svg)](https://opensource.org/licenses/Apache2.0)

# Usage

- Add `Ace`、`marked`、`highlight` and `fortawesome` lib

```html
<link href="https://cdn.bootcss.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet">
<link href="https://cdn.bootcss.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet">
<link href="https://cdn.bootcss.com/highlight.js/9.12.0/styles/agate.min.css" rel="stylesheet">
<script src="https://cdn.bootcss.com/ace/1.2.8/ace.js"></script>
<script src="https://cdn.bootcss.com/marked/0.3.6/marked.min.js"></script>
<script src="https://cdn.bootcss.com/highlight.js/9.12.0/highlight.min.js"></script>
```

- Install `ngx-markdown-editor`

```bash
npm i ngx-markdown-editor
```

- Use markdown-editor component

```ts
import { LMarkdownEditorModule } from 'ngx-markdown-editor';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    LMarkdownEditorModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```
```html
<md-editor name="Content" [preRender]="preRenderFunc" [(ngModel)]="content" [height]="'200px'" [mode]="mode" [options]="options" required maxlength="500"></md-editor>
```

# Options
- ngModel: markdown original content
- height: editor height
- hideToolbar: hide toolbar, default is false
- mode: `editor` | `preview`, default is `editor`
- options: other settings for editor
  ```javascript
  {
    "hideIcons": ['Bold', 'Italic', 'Heading', 'Refrence', 'Link', 'Image', 'Ul', 'Ol', 'Code', 'TogglePreview', 'FullScreen']  // default is empty, the value is case-sensitive
  }
  ```
- preRender(`Function`): For [#13](https://github.com/lon-yang/ngx-markdown-editor/issues/13), this will not effect `ngModel`'s value, just rendered value
  ```javascript
  preRenderFunc(content: string) {
    return content.replace(/something/g, 'new value'); // must return a string
  }
  ```
- required: for form validate
- maxlength: for form validate
