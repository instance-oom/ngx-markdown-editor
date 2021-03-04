# ngx-markdown-editor
Angular markdown editor based on ace editor

[![npm version](https://img.shields.io/npm/v/ngx-markdown-editor?color=rgb%2868%2C%20204%2C%2017%29)](https://badge.fury.io/js/ngx-markdown-editor)
[![peerDependencies Status](https://david-dm.org/lon-yang/ngx-markdown-editor/peer-status.svg)](https://david-dm.org/lon-yang/ngx-markdown-editor?type=peer)
[![npm](https://img.shields.io/npm/dm/ngx-markdown-editor?color=rgb%2868%2C%20204%2C%2017%29)](https://www.npmjs.com/package/ngx-markdown-editor)
[![GitHub license](https://img.shields.io/github/license/lon-yang/ngx-markdown-editor?color=rgb%2868%2C%20204%2C%2017%29)](https://github.com/lon-yang/ngx-markdown-editor/blob/master/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/lon-yang/ngx-markdown-editor?color=rgb%252868%252C%2520204%252C%252017%2529)](https://github.com/lon-yang/ngx-markdown-editor/stargazers)
![GitHub issues](https://img.shields.io/github/issues-raw/lon-yang/ngx-markdown-editor?color=rgb%2868%2C%20204%2C%2017%29)
[![StackBlitz](http://img.shields.io/badge/StackBlitz-Edit-blue)](https://stackblitz.com/edit/ngx-markdown-editor)

# Usage

### Installation

<details open>
<summary>>=3.0.0</summary>
<p></p>
Install dependencies from npm repository:
  
```bash
npm i ace-builds bootstrap font-awesome
```

Install `ngx-markdown-editor` from npm repository:

```bash
npm i ngx-markdown-editor
```

Add the assets、styles and scripts in `angular.json`:
```json
{
  ...
  "architect": {
    "build": {
      "options": {
        ...
        "assets": [
          {
            "glob": "**/*",
            "input": "node_modules/ace-builds/src-min",
            "output": "./assets/ace-builds/"
          }
        ],
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

Add `ace.js` in `index.html`
```html
<html>
  <head>
    <script src="/assets/ace-builds/ace.js"></script>
  </head>
  <body></body>
</html>
```
</details>

<details>
<summary><=2.5.0</summary>
<p></p>
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
</details>

### Sample

```ts
import { LMarkdownEditorModule } from 'ngx-markdown-editor';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule, // make sure FormsModule is imported to make ngModel work
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
  [postRender]="postRenderFunc"
  [(ngModel)]="content" 
  [height]="'200px'" 
  [mode]="mode" 
  [options]="options" 
  (onEditorLoaded)="onEditorLoaded($event)"
  (onPreviewDomChanged)="onPreviewDomChanged($event)"
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
    hideIcons?: Array<string>     // ['Bold', 'Italic', 'Heading', 'Reference', 'Link', 'Image', 'Ul', 'Ol', 'Code', 'TogglePreview', 'FullScreen']. Default is empty
    usingFontAwesome5?: boolean   // Using font awesome with version 5, Default is false
    scrollPastEnd?: number        // The option for ace editor. Default is 0
    enablePreviewContentClick?: boolean  // Allow user fire the click event on the preview panel, like href etc. Default is false
    resizable?: boolean           // Allow resize the editor
    markedjsOpt?: MarkedjsOption  // The markedjs option, see https://marked.js.org/#/USING_ADVANCED.md#options
    customRender?: {              // Custom markedjs render
      image?: Function     // Image Render
      table?: Function     // Table Render
      code?: Function      // Code Render
      listitem?: Function  // Listitem Render
    }
  }
  ```
- upload(`Function`): For [#24](https://github.com/lon-yang/ngx-markdown-editor/issues/24), upload file by yourself
  ```ts
  constructor() {
    this.doUpload = this.doUpload.bind(this);  // This is very important.
  }
  
  doUpload(files: Array<File>): Promise<Array<UploadResult>> {
    // do upload file by yourself
    return Promise.resolve([{ name: 'xxx', url: 'xxx.png', isImg: true }]);
  }
  
  interface UploadResult {
    isImg: boolean
    name: string
    url: string
  }
  ```  
- preRender(`Function`): For [#13](https://github.com/lon-yang/ngx-markdown-editor/issues/13), this will not effect `ngModel`'s value, just rendered value
  ```ts
  preRenderFunc(content: string) {
    return content.replace(/something/g, 'new value'); // must return a string
  }
  ```
- postRender(`Function`): Change the html souce code generated by `marked` before update the dom
  ```ts
  postRenderFunc(content: string) {
    return content.replace(/something/g, 'new value'); // must return a string
  }
  ```  
- required: for form validate
- maxlength: for form validate

> Tips: For `Function` input, please call bind at `constructor` to assign correct `this` pointer

# Event
- `onEditorLoaded: EventEmitter<AceEditor>` Fires when the ace editor loaded.
- `onPreviewDomChanged: EventEmitter<HTMLElement>` Fires when the preview dom updated
