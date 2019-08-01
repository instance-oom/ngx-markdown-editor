import { Component, ViewChild, forwardRef, Renderer, Attribute, Input, ElementRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, NG_VALIDATORS, Validator, AbstractControl, ValidationErrors } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { MdEditorOption } from './md-editor.types';

declare let ace: any;
declare let marked: any;
declare let hljs: any;

@Component({
  selector: 'md-editor',
  styleUrls: ['./md-editor.scss'],
  templateUrl: './md-editor.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MarkdownEditorComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => MarkdownEditorComponent),
      multi: true
    }
  ]
})

export class MarkdownEditorComponent implements ControlValueAccessor, Validator {

  @ViewChild('aceEditor', { static: false }) public aceEditorContainer: ElementRef;
  @Input() public hideToolbar: boolean = false;
  @Input() public height: string = "300px";
  @Input() public preRender: Function;
  @Input() public upload: Function;

  @Input()
  public get mode(): string {
    return this._mode || 'editor';
  }
  public set mode(value: string) {
    if (!value || (value.toLowerCase() !== 'editor' && value.toLowerCase() !== 'preview')) {
      value = 'editor';
    }
    this._mode = value;
  }
  private _mode: string;

  @Input()
  public get options(): MdEditorOption {
    return this._options || {};
  }
  public set options(value: MdEditorOption) {
    this._options = Object.assign(this._defaultOption, {}, value);
    this.hideIcons = {};
    if (this._options.hideIcons) {
      this._options.hideIcons.forEach((v: any) => this.hideIcons[v] = true);
    }
  }
  private _options: any = {};

  public hideIcons: any = {};
  public showPreviewPanel: boolean = true;
  public isFullScreen: boolean = false;
  public previewHtml: any;
  public dragover: boolean = false;
  public isUploading: boolean = false;

  public get markdownValue(): any {
    return this._markdownValue || '';
  }
  public set markdownValue(value: any) {
    this._markdownValue = value;
    this._onChange(value);

    if (this.preRender && this.preRender instanceof Function) {
      value = this.preRender(value);
    }
    if (value !== null && value !== undefined) {
      if (this._renderMarkTimeout) clearTimeout(this._renderMarkTimeout);
      this._renderMarkTimeout = setTimeout(() => {
        let html = marked(value || '', this._markedOpt);
        this.previewHtml = this._domSanitizer.bypassSecurityTrustHtml(html);
      }, 100);
    }
  }
  private _markdownValue: any;

  private _editor: any;
  private _editorResizeTimer: any;
  private _renderMarkTimeout: any;
  private _markedOpt: any;
  private _defaultOption: MdEditorOption = {
    showBorder: true,
    hideIcons: [],
    scrollPastEnd: 0,
    enablePreviewContentClick: false,
    resizable: false
  };
  private get _hasUploadFunction(): boolean {
    return this.upload && this.upload instanceof Function;
  }

  private _onChange = (_: any) => { };
  private _onTouched = () => { };

  constructor(
    @Attribute('required') public required: boolean = false,
    @Attribute('maxlength') public maxlength: number = -1,
    private _renderer: Renderer,
    private _domSanitizer: DomSanitizer) {

  }

  ngOnInit() {
    let markedRender = new marked.Renderer();
    markedRender.code = (code: any, language: any) => {
      let validLang = !!(language && hljs.getLanguage(language));
      let highlighted = validLang ? hljs.highlight(language, code).value : code;
      return `<pre style="padding: 0; border-radius: 0;"><code class="hljs ${language}">${highlighted}</code></pre>`;
    };
    markedRender.table = (header: string, body: string) => {
      return `<table class="table table-bordered">\n<thead>\n${header}</thead>\n<tbody>\n${body}</tbody>\n</table>\n`;
    };
    markedRender.listitem = (text: any, task: boolean, checked: boolean) => {
      if (/^\s*\[[x ]\]\s*/.test(text) || text.startsWith('<input')) {
        if (text.startsWith('<input')) {
          text = text
            .replace('<input disabled="" type="checkbox">', '<i class="fa fa-square-o"></i>')
            .replace('<input checked="" disabled="" type="checkbox">', '<i class="fa fa-check-square"></i>');
        } else {
          text = text
            .replace(/^\s*\[ \]\s*/, '<i class="fa fa-square-o"></i> ')
            .replace(/^\s*\[x\]\s*/, '<i class="fa fa-check-square"></i> ');
        }
        return `<li>${text}</li>`;
      } else {
        return `<li>${text}</li>`;
      }
    };
    let markedjsOpt = {
      renderer: markedRender,
      highlight: (code: any) => hljs.highlightAuto(code).value
    };
    this._markedOpt = Object.assign({}, this.options.markedjsOpt, markedjsOpt);
  }

  ngAfterViewInit() {
    let editorElement = this.aceEditorContainer.nativeElement;
    this._editor = ace.edit(editorElement);
    this._editor.$blockScrolling = Infinity;
    this._editor.getSession().setUseWrapMode(true);
    this._editor.getSession().setMode("ace/mode/markdown");
    this._editor.setValue(this.markdownValue || '', 1);
    this._editor.setOption('scrollPastEnd', this._options.scrollPastEnd || 0);

    this._editor.on("change", (e: any) => {
      let val = this._editor.getValue();
      this.markdownValue = val;
    });
  }

  ngOnDestroy() {
    this._editor && this._editor.destroy();
  }

  writeValue(value: any | Array<any>): void {
    setTimeout(() => {
      this.markdownValue = value;
      if (typeof value !== 'undefined' && this._editor) {
        this._editor.setValue(value || '', 1);
      }
    }, 1);
  }

  registerOnChange(fn: (_: any) => {}): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => {}): void {
    this._onTouched = fn;
  }

  validate(c: AbstractControl): ValidationErrors {
    let result: any = null;
    if (this.required && this.markdownValue.length === 0) {
      result = { required: true };
    }
    if (this.maxlength > 0 && this.markdownValue.length > this.maxlength) {
      result = { maxlength: true };
    }
    return result;
  }

  insertContent(type: string, customContent?: string) {
    if (!this._editor) return;
    let selectedText = this._editor.getSelectedText();
    let isSelected = !!selectedText;
    let startSize = 2;
    let initText: string = '';
    let range = this._editor.selection.getRange();
    switch (type) {
      case 'Bold':
        initText = 'Bold Text';
        selectedText = `**${selectedText || initText}**`;
        break;
      case 'Italic':
        initText = 'Italic Text';
        selectedText = `*${selectedText || initText}*`;
        startSize = 1;
        break;
      case 'Heading':
        initText = 'Heading';
        selectedText = `# ${selectedText || initText}`;
        break;
      case 'Refrence':
        initText = 'Refrence';
        selectedText = `> ${selectedText || initText}`;
        break;
      case 'Link':
        selectedText = `[](http://)`;
        startSize = 1;
        break;
      case 'Image':
        selectedText = `![](http://)`;
        break;
      case 'Ul':
        selectedText = `- ${selectedText || initText}`
        break;
      case 'Ol':
        selectedText = `1. ${selectedText || initText}`
        startSize = 3;
        break;
      case 'Code':
        initText = 'Source Code';
        selectedText = "```language\r\n" + (selectedText || initText) + "\r\n```";
        startSize = 3;
        break;
      case 'Custom':
        selectedText = customContent;
        startSize = 0;
        break;
    }
    this._editor.session.replace(range, selectedText);
    if (!isSelected) {
      range.start.column += startSize;
      range.end.column = range.start.column + initText.length;
      this._editor.selection.setRange(range);
    }
    this._editor.focus();
  }

  togglePreview() {
    this.showPreviewPanel = !this.showPreviewPanel;
    this.editorResize();
  }

  previewPanelClick(event: Event) {
    if (this.options.enablePreviewContentClick !== true) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }

  fullScreen() {
    this.isFullScreen = !this.isFullScreen;
    this._renderer.setElementStyle(document.body, 'overflowY', this.isFullScreen ? 'hidden' : 'auto');
    this.editorResize();
  }

  mdEditorResize(size: any) {
    this.editorResize();
  }

  editorResize(timeOut: number = 100) {
    if (!this._editor) return
    if (this._editorResizeTimer) clearTimeout(this._editorResizeTimer);
    this._editorResizeTimer = setTimeout(() => {
      this._editor.resize();
      this._editor.focus();
    }, timeOut);
  }

  onDragover(evt: DragEvent) {
    evt.stopImmediatePropagation();
    evt.preventDefault();
    if (!this._hasUploadFunction) return;
    this.dragover = true;
  }

  onDrop(evt: DragEvent) {
    evt.stopImmediatePropagation();
    evt.preventDefault();
    if (!this._hasUploadFunction || this.isUploading) return;

    if (!evt.dataTransfer.files || evt.dataTransfer.files.length === 0) {
      this.dragover = false;
      return;
    }

    this.isUploading = true;
    Promise.resolve()
      .then(() => {
        return this.upload(evt.dataTransfer.files);
      })
      .then(data => {
        if (Array.isArray(data)) {
          let msg = [];
          for (let item of data) {
            let tempMsg = `[${item.name}](${item.url})`;
            if (item.isImg) {
              tempMsg = `!${tempMsg}`;
            }
            msg.push(tempMsg);
          }
          this.insertContent('Custom', msg.join('\r\n'));
        } else {
          console.warn('Invalid upload result. Please using follow this type `UploadResult`.')
        }
        this.isUploading = false;
        this.dragover = false;
      })
      .catch(err => {
        console.error(err);
        this.isUploading = false;
        this.dragover = false;
      });
  }

  onDragleave(evt: DragEvent) {
    evt.stopImmediatePropagation();
    evt.preventDefault();
    if (!this._hasUploadFunction) return;
    this.dragover = false;
  }
}
