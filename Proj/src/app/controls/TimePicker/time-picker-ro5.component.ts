import {
  Component,
  OnInit,
  ViewChildren,
  QueryList,
  ElementRef,
  Input
} from '@angular/core';

@Component({
  selector: 'rom-time-picker-ro5',
  templateUrl: './time-picker-ro5.component.html',
  styleUrls: ['./time-picker-ro5.component.less']
})
export class TimePickerRo5Component implements OnInit {
  @ViewChildren('timeInput') inputs: QueryList<ElementRef>;
  @Input() hour: number;
  @Input() minute: number;
  @Input() second: number;

  constructor() {}

  ngOnInit() {}

  manualInput(durationType: string, event: any) {
    const query = this.inputs.toArray();
    if (event.key === 'Backspace') {
      return;
    }

    this.checkReset();

    switch (durationType) {
      case 'hour':
        this.runLogic(event, query, 1);
        break;
      case 'minute':
        this.runLogic(event, query, 2);
        break;
      case 'second':
        this.charInput(event);
        this.checkReset();
        break;
      default:
        break;
    }
  }

  getTime() {
    return [this.hour, this.minute, this.second]
      .map(val => {
        if (isNaN(val)) {
          val = 0;
        }
        return val.toString().length !== 2 ? `0${val}` : val;
      })
      .join(':');
  }

  private charInput(event: any) {
    if (event.target.value.length > 2) {
      if (!isNaN(event.key)) {
        event.target.value = event.key;
      } else {
        event.target.value = 0;
      }
    }
  }

  private runLogic(event: any, query: ElementRef<any>[], nextIndex: number) {
    const val = event.target.value;
    if (val.length === 2 && val === event.target.max) {
      if (event.key !== 'ArrowLeft' || event.key !== 'ArrowRight') {
        this.checkReset();
        if (event.key !== 'Tab') {
          query[nextIndex].nativeElement.focus();
        }
      }
    } else {
      this.charInput(event);
    }
  }

  checkReset() {
    this.inputs.forEach(ele => {
      const element = ele.nativeElement;
      if (element.value > +element.max || element.value < element.min) {
        element.value = '';
      }
    });
  }
}
