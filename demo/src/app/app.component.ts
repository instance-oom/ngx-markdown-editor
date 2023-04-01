import { Component, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { UploadResult, MdEditorOption } from './../../../src/public_api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public maxLength = 300;
  public options: MdEditorOption = {
    showPreviewPanel: true,
    enablePreviewContentClick: false,
    resizable: true,
    customRender: {
      image: function (href: string, title: string, text: string) {
        let out = `<img style="max-width: 100%; border: 20px solid red;" src="${href}" alt="${text}"`;
        if (title) {
          out += ` title="${title}"`;
        }
        out += (<any>this.options).xhtml ? "/>" : ">";
        return out;
      }
    },
    fontAwesomeVersion: '6',
    // usingFontAwesome5: true,
    // customIcons: {
    //   Bold: { fontClass: 'fa-solid fa-bold' },
    //   Italic: { fontClass: 'fa-solid fa-italic' },
    //   Heading: { fontClass: 'fa-solid fa-heading' },
    //   Reference: { fontClass: 'fa-solid fa-quote-left' },
    //   Link: { fontClass: 'fa-solid fa-link' },
    //   Image: { fontClass: 'fa-solid fa-image' },
    //   UnorderedList: { fontClass: 'fa-solid fa-list-ul' },
    //   OrderedList: { fontClass: 'fa-solid fa-list-ol' },
    //   CodeBlock: { fontClass: 'fa-solid fa-file-code' },
    //   ShowPreview: { fontClass: 'fa-solid fa-eye' },
    //   HidePreview: { fontClass: 'fa-solid fa-eye-slash' },
    //   FullScreen: { fontClass: 'fa-solid fa-maximize' },
    //   CheckBox_UnChecked: { fontClass: 'fa-regular fa-square' },
    //   CheckBox_Checked: { fontClass: 'fa-solid fa-check-square' }
    // },
    markedjsOpt: {
      sanitize: true
    }
  };
  public content: string;
  public mode: string = 'editor';

  constructor(private _domSanitizer: DomSanitizer) {
    this.preRender = this.preRender.bind(this);
    this.postRender = this.postRender.bind(this);
  }

  ngOnInit() {
    let contentArr = ['# Hello, Markdown Editor!'];
    contentArr.push('```javascript ');
    contentArr.push('function Test() {');
    contentArr.push('	console.log("Test");');
    contentArr.push('}');
    contentArr.push('```');
    contentArr.push(' Name | Type');
    contentArr.push(' ---- | ----');
    contentArr.push(' A | Test');
    contentArr.push('![](http://lon-yang.github.io/markdown-editor/favicon.ico)');
    contentArr.push('');
    contentArr.push('- [ ] Taks A');
    contentArr.push('- [x] Taks B');
    contentArr.push('- test');
    contentArr.push('');
    contentArr.push('[Link](https://www.google.com)');
    contentArr.push(`<img src="1" onerror="alert(1)" />`);
    contentArr.push('');
    this.content = contentArr.join('\r\n');
  }

  togglePreviewPanel() {
    this.options.showPreviewPanel = !this.options.showPreviewPanel;
    this.options = Object.assign({}, this.options);
  }

  changeMode() {
    if (this.mode === 'editor') {
      this.mode = 'preview';
    } else {
      this.mode = 'editor';
    }
  }

  togglePreviewClick() {
    this.options.enablePreviewContentClick = !this.options.enablePreviewContentClick;
    this.options = Object.assign({}, this.options);
  }

  toggleResizeAble() {
    this.options.resizable = !this.options.resizable;
    this.options = Object.assign({}, this.options);
  }

  uploadImg(evt) {
    if (!evt) return;
    const file = evt.target.files[0];
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      this.content += `![](${reader.result})`
    }, false);

    if (file) reader.readAsDataURL(file);
  }

  doUpload(files: Array<File>): Promise<Array<UploadResult>> {
    console.log(files);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let result: Array<UploadResult> = [];
        for (let file of files) {
          result.push({
            name: file.name,
            url: `https://avatars3.githubusercontent.com/${file.name}`,
            isImg: file.type.indexOf('image') !== -1
          })
        }
        resolve(result);
      }, 3000);
    });
  }

  onEditorLoaded(editor) {
    console.log(`ACE Editor Ins: `, editor);

    editor.setShowPrintMargin(false)

    // editor.setOption('showLineNumbers', false);

    // setTimeout(() => {
    //   editor.setOption('showLineNumbers', true);
    // }, 2000);
  }

  preRender(mdContent) {
    console.log(`preRender fired`);
    // return new Promise((resolve) => {
    //   setTimeout(() => {
    //     resolve(mdContent);
    //   }, 4000);
    // })
    return mdContent;
  }

  postRender(html) {
    console.log(`postRender fired`);
    // return '<h1>Test</h1>';
    return html;
  }

  onPreviewDomChanged(dom: HTMLElement) {
    console.log(`onPreviewDomChanged fired`);
    // console.log(dom);
    // console.log(dom.innerHTML)
  }
}
