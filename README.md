# ngx-markdown-editor
Angular markdown editor based on ace editor

[![peerDependencies Status](https://david-dm.org/lon-yang/ngx-markdown-editor/peer-status.svg)](https://david-dm.org/lon-yang/ngx-markdown-editor?type=peer)
[![npm version](https://badge.fury.io/js/ngx-markdown-editor.svg)](https://badge.fury.io/js/ngx-markdown-editor)
[![npm](https://img.shields.io/npm/dt/ngx-markdown-editor.svg)](https://www.npmjs.com/package/ngx-markdown-editor)
[![GitHub license](https://img.shields.io/github/license/lon-yang/ngx-markdown-editor.svg)](https://github.com/lon-yang/ngx-markdown-editor/blob/master/LICENSE)

# Usage

### Installation

> Tips: This is a new way to add dependencies since `2.1.0`, and the old way is work fine too.

Install dependencies from npm repository:
```bash
npm i brace bootstrap font-awesome
```

Install `ngx-markdown-editor` from npm repository:
```bash
npm i ngx-markdown-editor
```

Add the styles and scripts in `angular.json`:
```json
{
  ...
  "architect": {
    "build": {
      "options": {
        ...
        "styles": [
          "node_modules/bootstrap/dist/css/bootstrap.min.css",
          "node_modules/font-awesome/css/font-awesome.min.css",
          "node_modules/ngx-markdown-editor/assets/highlight.js/agate.min.css"
        ],
        "scripts": [
          "node_modules/ngx-markdown-editor/assets/highlight.js/highlight.min.js",
          "node_modules/ngx-markdown-editor/assets/marked.min.js"
        ]
        ...
      }
    }
  }
  ...    
}
```

Import `brace` in `polyfills.ts`

```ts
import 'brace';
import 'brace/mode/markdown';
```

### Sample

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
<md-editor name="Content" 
  [upload]="doUpload" 
  [preRender]="preRenderFunc" 
  [(ngModel)]="content" 
  [height]="'200px'" 
  [mode]="mode" 
  [options]="options" 
  required 
  maxlength="500">
</md-editor>
```

# Options
- ngModel: markdown original content
- height: editor height
- hideToolbar: hide toolbar, default is false
- mode: `editor` | `preview`, default is `editor`
- options: other settings for editor
  ```ts
  {  
    showPreviewPanel?: boolean    // Show preview panel, Default is true
    showBorder?: boolean          // Show editor component's border. Default is true
    hideIcons?: Array<string>     // ['Bold', 'Italic', 'Heading', 'Refrence', 'Link', 'Image', 'Ul', 'Ol', 'Code', 'TogglePreview', 'FullScreen']. Default is empty
    usingFontAwesome5?: boolean   // Using font awesome with version 5, Default is false
    scrollPastEnd?: number        // The option for ace editor. Default is 0
    enablePreviewContentClick?: boolean  // Allow user fire the click event on the preview panel, like href etc. Default is false
    resizable?: boolean           // Allow resize the editor
    markedjsOpt?: MarkedjsOption  // The markedjs option, see https://marked.js.org/#/USING_ADVANCED.md#options
  }
  ```
- preRender(`Function`): For [#13](https://github.com/lon-yang/ngx-markdown-editor/issues/13), this will not effect `ngModel`'s value, just rendered value
  ```ts
  preRenderFunc(content: string) {
    return content.replace(/something/g, 'new value'); // must return a string
  }
  ```
- upload(`Function`): For [#24](https://github.com/lon-yang/ngx-markdown-editor/issues/24), upload file by yourself
  ```ts
  constructor() {
    this.doUpload = this.doUpload.bind(this);  // This is very important.
  }
  
  doUpload(files: Array<File>): Promise<Array<UploadResult>> {
    // do upload file by yourself
    return Pormise.resolve([{ name: 'xxx', url: 'xxx.png', isImg: true }]);
  }
  
  interface UploadResult {
    isImg: boolean
    name: string
    url: string
  }
  ```

- required: for form validate
- maxlength: for form validate
