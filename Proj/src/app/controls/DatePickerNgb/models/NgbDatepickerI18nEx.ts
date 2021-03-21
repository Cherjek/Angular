import { NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateStructEx } from './NgbDateStructEx'
import * as Constants from '../../../common/Constants';

export class NgbDatepickerI18nEx extends NgbDatepickerI18n {

    readonly ru = Constants.Common.Constants.CALENDAR_RU;

    getWeekdayShortName(weekday: number): string {
        return this.ru.dayNamesShortAlt[weekday - 1];
    }
    getMonthShortName(month: number): string {
        return this.ru.monthNamesShort[month - 1];
    }
    getMonthFullName(month: number): string {
        return this.ru.monthNames[month - 1];
    }
    getDayAriaLabel(date: NgbDateStructEx): string {
        return `${date.day}-${date.month}-${date.year}`;
    }

}