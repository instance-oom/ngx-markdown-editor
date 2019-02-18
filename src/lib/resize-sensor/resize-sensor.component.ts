import { Component, NgZone, Input, Output, ViewChild, ElementRef, EventEmitter } from '@angular/core';

@Component({
  selector: 'md-editor-resize-sensor',
  templateUrl: './resize-sensor.html',
  styleUrls: ['./resize-sensor.scss']
})

export class MarkdownEditorResizeSensorComponent {

  @ViewChild('resizeSensor') resizeSensor: ElementRef;

  @Input() interval: number = 500;
  @Output() resize: EventEmitter<any> = new EventEmitter<any>();

  private sizeInfo: any = {
    width: 0,
    height: 0
  }

  constructor(private _ngZone: NgZone) {

  }

  ngAfterViewInit() {
    this.sizeInfo = {
      width: this.resizeSensor.nativeElement.offsetWidth,
      height: this.resizeSensor.nativeElement.offsetHeight
    }
    this._ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        this.detectSize();
      }, this.interval);
    });
  }

  private detectSize() {
    let width = this.resizeSensor.nativeElement.offsetWidth;
    let height = this.resizeSensor.nativeElement.offsetHeight;
    if (this.sizeInfo.width !== width || this.sizeInfo.height !== height) {
      this.sizeInfo = {
        width: width,
        height: height
      }
      this.resize.emit(this.sizeInfo);
    }
    setTimeout(() => {
      this.detectSize();
    }, this.interval);
  }
}
