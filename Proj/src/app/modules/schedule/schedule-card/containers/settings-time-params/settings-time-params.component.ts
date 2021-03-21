import { AppLocalization } from 'src/app/common/LocaleRes';
import {
  Component,
  OnInit,
  Input,
  ViewChild,
  AfterViewChecked
} from '@angular/core';
import { ITimeParamsSettings } from '../models/timeparams-settings';
import { ITimeSettings } from '../models/time-settings';
import { TimePickerRo5Component } from 'src/app/controls/TimePicker/time-picker-ro5.component';

@Component({
  selector: 'rom-settings-time-params',
  templateUrl: './settings-time-params.component.html',
  styleUrls: ['./settings-time-params.component.less']
})
export class SettingsTimeParamsComponent implements OnInit {
  // multiple: boolean;
  constructor() {}
  repeatValue = 1;
  @Input() isPropEdit = false;
  @Input() data: ITimeParamsSettings;
  repeatStartTimeValue = new Date();
  repeatEndTimeValue = new Date();
  _repeatTypeValue: any;
  repeatTypeValueCode = '';

  @ViewChild('timePicker', { static: false })
  timePicker: TimePickerRo5Component;
  @ViewChild('timePicker1', { static: false })
  timePicker1: TimePickerRo5Component;
  @ViewChild('timePicker2', { static: false })
  timePicker2: TimePickerRo5Component;

  onceHour: any;
  onceMinute: any;
  onceSecond: any;
  fromMultHour: any;
  fromMultMinute: any;
  fromMultSecond: any;
  toMultHour: any;
  toMultMinute: any;
  toMultSecond: any;

  once = true;

  get repeatTypeValue() {
    return this._repeatTypeValue;
  }

  set repeatTypeValue(value) {
    this._repeatTypeValue = value;
    if (value != null) {
      this.repeatTypeValueCode = value.Code;
    }
  }

  repeatType: any[] = [
    {
      Id: 1,
      Code: 'Hours',
      Name: AppLocalization.Label117
    },
    {
      Id: 2,
      Code: 'Minutes',
      Name: AppLocalization._minute_s
    },
    {
      Id: 3,
      Code: 'Seconds',
      Name: AppLocalization.Label81
    },
  ];

  ngOnInit() {
    if (this.data) {
      this.init();
    }
  }

  init() {
    this.once = this.data.OneTime;
    if (this.once) {
      const date = new Date(this.data.RunTime);
      this.onceHour = date.getHours();
      this.onceMinute = date.getMinutes();
      this.onceSecond = date.getSeconds();
    } else {
      this.repeatValue = this.data.RepeatCount;
      this.repeatTypeValueCode = this.data.RepeatType;
      const fromDate = new Date(this.data.StartTime);
      this.fromMultHour = fromDate.getHours();
      this.fromMultMinute = fromDate.getMinutes();
      this.fromMultSecond = fromDate.getSeconds();
      this.repeatTypeValue = this.repeatType.find(x => x.Code === this.data.RepeatType);

      const toDate = new Date(this.data.EndTime);
      this.toMultHour = toDate.getHours();
      this.toMultMinute = toDate.getMinutes();
      this.toMultSecond = toDate.getSeconds();
    }
  }
}
