import { ScheduleSettings } from './schedule-settings';
import { SettingsMonthlyComponent } from '../settings-monthly/settings-monthly.component';
import { IMonthly } from './monthly';
import { SettingsWeeklyComponent } from '../settings-weekly/settings-weekly.component';
import { Weekly } from './weekly';
import { SettingsDailyComponent } from '../settings-daily/settings-daily.component';
import { Daily } from './daily';
import { SettingsOnetimeComponent } from '../settings-onetime/settings-onetime.component';
import { OneTime } from './onetime';
import { IData } from 'src/app/services/data-query';
import { ScheduleCardTriggerComponent } from '../../components/schedule-card-trigger/schedule-card-trigger.component';
import { ITimeParamsSettings } from './timeparams-settings';
import { SettingsTimeParamsComponent } from '../settings-time-params/settings-time-params.component';
import { Utils } from 'src/app/core';

export function mapFactory(child: any, parent: ScheduleCardTriggerComponent) {
  let selectedComp;
  let scheduleSettings = new ScheduleSettings();
  const useDateBounds = !parent.useDateBounds;
  scheduleSettings = {
    Active: parent.active,
    UseDateBounds: useDateBounds,
    StartDateTime: useDateBounds ? Utils.DateConvert.toDateTimeRequest(parent.startDate) : null,
    EndDateTime: useDateBounds ? Utils.DateConvert.toDateTimeRequest(parent.endDate) : null,
    TriggerType: parent.typeValues.find(
      (x: IData) => x.Code === parent.componentCode
    )
  };
  if (child == null) {
    return scheduleSettings;
  }
  switch (parent.componentCode) {
    case 'Monthly':
      selectedComp = child as SettingsMonthlyComponent;
      scheduleSettings[parent.componentCode] = {
        Months: selectedComp.selectedMonths,
        ByDays: selectedComp.byDays,
        Days: selectedComp.byDays ? selectedComp.selectedMonthDays : [],
        WeekDays: !selectedComp.byDays ? selectedComp.selectedWeekDays : [],
        Weeks: !selectedComp.byDays ? selectedComp.selectedOrders : [],
        Time: mapTime(selectedComp)
      } as IMonthly;
      break;
    case 'Weekly':
      selectedComp = child as SettingsWeeklyComponent;
      scheduleSettings[parent.componentCode] = {
        FirstDate: Utils.DateConvert.toDateTimeRequest(selectedComp.startDate),
        RepeatWeeks: selectedComp.repeatValue,
        WeekDays: selectedComp.selectedDays,
        Time: mapTime(selectedComp)
      } as Weekly;
      break;
    case 'Daily':
      selectedComp = child as SettingsDailyComponent;
      scheduleSettings[parent.componentCode] = {
        FirstDate: Utils.DateConvert.toDateTimeRequest(selectedComp.startDate),
        RepeatDays: selectedComp.repeatValue,
        Time: mapTime(selectedComp)
      } as Daily;
      break;
    case 'OneTime':
      selectedComp = child as SettingsOnetimeComponent;
      scheduleSettings[parent.componentCode] = {
        RunDateTime: Utils.DateConvert.toDateTimeRequest(selectedComp.startDate)
      } as OneTime;
      break;

    default:
      break;
  }
  return scheduleSettings;
}

function mapTime(selectedComp: any): ITimeParamsSettings {
  const params = selectedComp.timeParams;
  const once = params.once;
  const time = params.timePicker.getTime();
  const time1 = params.timePicker1.getTime();
  const time2 = params.timePicker2.getTime();

  let RunTime: string;
  let StartTime: string;
  let EndTime: string;
  const splitTime = (time: string) => {
    return `0001-01-01T${time}`;
  }
  if (once) {
    if (time) {
      RunTime = splitTime(time);
    }
  } else {
    if (time1) {
      StartTime = splitTime(time1);
    }
    if (time2) {
      EndTime = splitTime(time2);
    }
  }

  const checkRepeat = (par: SettingsTimeParamsComponent) => {
    if (once || par._repeatTypeValue === null) { return null; }
    return par.repeatTypeValueCode;
  };

  return {
    OneTime: once,
    RunTime: once ? RunTime : null,
    StartTime: !once ? StartTime : null,
    EndTime: !once ? EndTime : null,
    RepeatCount: !once ? params.repeatValue : 0,
    RepeatType: checkRepeat(params)
  };
}
