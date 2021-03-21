import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { CalendarPickerType } from 'src/app/controls/CalendarPicker/calendar-picker-ro5.component';
import { IData } from 'src/app/services/data-query';
import { Common } from 'src/app/common/Constants';

import Constants = Common.Constants;
import { IMonthly } from '../models/monthly';
import { SettingsTimeParamsComponent } from '../settings-time-params/settings-time-params.component';

@Component({
  selector: 'rom-settings-monthly',
  templateUrl: './settings-monthly.component.html',
  styleUrls: ['./settings-monthly.component.less']
})
export class SettingsMonthlyComponent implements OnInit {
  calendarPickerTypes = CalendarPickerType;
  months = Constants.CALENDAR_RU.monthNames as string[];
  weeks = Constants.CALENDAR_RU.dayNamesShortAlt as string[];

  @Input() data: IMonthly;
  @Input() isPropEdit = false;
  @ViewChild('timeParams', { static: false })
  timeParams: SettingsTimeParamsComponent;
  _typeDaysValue: IData;
  typeDaysValueCode = '';
  selectedMonths: number[] = [];
  selectedMonthDays: number[] = [];
  selectedWeekDays: number[] = [];
  selectedOrders: number[] = [];
  byDays: boolean;

  get typeDaysValue() {
    return this._typeDaysValue;
  }

  set typeDaysValue(value) {
    this._typeDaysValue = value;
    if (value != null) {
      this.typeDaysValueCode = value.Code;
    }
  }

  typeDays: IData[] = [
    {
      Id: 1,
      Code: 'dayMonth',
      Name: AppLocalization._monthy
    },
    {
      Id: 2,
      Code: 'dayWeek',
      Name: AppLocalization.Label4
    }
  ];

  constructor() {}

  ngOnInit() {
    if (this.data) {
      this.init();
    } else {
      this.setDefaults();
    }
  }

  optionControlDropDown(event: any) {
    const property = event.property;
    property.arrayValue = this.typeDays;
  }

  private setDefaults() {
    this.byDays = true;
    this.typeDaysValue = this.typeDays[0];
  }

  private init() {
    this.byDays = this.data.ByDays;
    this.selectedMonths = this.data.Months;
    this.selectedMonthDays = this.data.Days;
    this.selectedWeekDays = this.data.WeekDays;
    this.selectedOrders = this.data.Weeks;
    this.typeDaysValue = this.data.ByDays ? this.typeDays[0] : this.typeDays[1];
  }
}
