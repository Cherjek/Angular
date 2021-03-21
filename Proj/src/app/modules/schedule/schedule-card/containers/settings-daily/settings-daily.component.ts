import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { SettingsTimeParamsComponent } from '../settings-time-params/settings-time-params.component';
import { IDaily } from '../models/daily';

@Component({
  selector: 'rom-settings-daily',
  templateUrl: './settings-daily.component.html',
  styleUrls: ['./settings-daily.component.less']
})
export class SettingsDailyComponent implements OnInit {
  startDate: Date | string;
  repeatValue = 1;

  @Input() data: IDaily;
  @Input() isPropEdit = false;
  @ViewChild('timeParams', { static: false }) timeParams: SettingsTimeParamsComponent;

  constructor() {}

  ngOnInit() {
    if (this.data) {
      this.init();
    }
  }

  private init() {
    this.startDate = this.data.FirstDate;
    this.repeatValue = this.data.RepeatDays;
  }
}
