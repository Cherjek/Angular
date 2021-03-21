import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { CalendarPickerType } from 'src/app/controls/CalendarPicker/calendar-picker-ro5.component';
import { SettingsTimeParamsComponent } from '../settings-time-params/settings-time-params.component';
import { IWeekly } from '../models/weekly';

@Component({
  selector: 'rom-settings-weekly',
  templateUrl: './settings-weekly.component.html',
  styleUrls: ['./settings-weekly.component.less']
})
export class SettingsWeeklyComponent implements OnInit {
  startDate: string | Date;
  repeatValue = 1;
  selectedDays: number[] = [];
  calendarPickerTypes = CalendarPickerType;
  @ViewChild('timeParams', { static: false })
  timeParams: SettingsTimeParamsComponent;
  @Input() isPropEdit = false;
  @Input() data: IWeekly;

  constructor() {}

  ngOnInit() {
    if (this.data) {
      this.init();
    }
  }

  private init() {
    this.selectedDays = this.data.WeekDays;
    this.repeatValue = this.data.RepeatWeeks;
    this.startDate = this.data.FirstDate;
  }
}
