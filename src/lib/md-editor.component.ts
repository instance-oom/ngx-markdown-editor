import { Component, ViewChild, forwardRef, Renderer, Attribute, Input, ElementRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, NG_VALIDATORS, Validator, AbstractControl, ValidationErrors } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { MdEditorOption } from './md-editor.types';

declare let ace: any;
declare let marked: any;
declare let hljs: any;

@Component({
  selector: 'md-editor',
  styleUrls: ['./md-editor.css'],
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

  @ViewChild('aceEditor') public aceEditorContainer: ElementRef;
  @Input() public hideToolbar: boolean = false;
  @Input() public height: string = "300px";
  @Input() public preRender: Function;

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
    return this._options;
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
  private _renderMarkTimeout: any;
  private _markedOpt: any;
  private _defaultOption: MdEditorOption = {
    showBorder: true,
    hideIcons: [],
    scrollPastEnd: 0,
    enablePreviewContentClick: false
  };
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

    markedRender.listitem = (text: any) => {
      if (/^\s*\[[x ]\]\s*/.test(text)) {
        text = text
          .replace(/^\s*\[ \]\s*/, '<i class="fa fa-square-o" style="margin: 0 0.2em 0.25em -1.6em;"></i> ')
          .replace(/^\s*\[x\]\s*/, '<i class="fa fa-check-square" style="margin: 0 0.2em 0.25em -1.6em;"></i> ');
        return `<li style="list-style: none;">${text}</li>`;
      } else {
        return `<li>${text}</li>`;
      }
    };

    this._markedOpt = {
      renderer: markedRender,
      highlight: (code: any) => hljs.highlightAuto(code).value
    };
  }

  ngAfterViewInit() {
    let editorElement = this.aceEditorContainer.nativeElement;
    this._editor = ace.edit(editorElement);
    this._editor.$blockScrolling = Infinity;
    this._editor.getSession().setUseWrapMode(true);
    this._editor.getSession().setMode("ace/mode/markdown");
    this._editor.setValue(this.markdownValue || '');
    this._editor.setOption('scrollPastEnd', this._options.scrollPastEnd || 0);

    this._editor.on("change", (e: any) => {
      let val = this._editor.getValue();
      this.markdownValue = val;
    });
  }

  ngOnDestroy() {
  }

  writeValue(value: any | Array<any>): void {
    setTimeout(() => {
      this.markdownValue = value;
      if (typeof value !== 'undefined' && this._editor) {
        this._editor.setValue(value || '');
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

  insertContent(type: string) {
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

  editorResize(timeOut: number = 100) {
    if (this._editor) {
      setTimeout(() => {
        this._editor.resize();
        this._editor.focus();
      }, timeOut);
    }
  }
}
