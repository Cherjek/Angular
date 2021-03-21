import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Common } from '../../common/Constants';
import Constants = Common.Constants;

export enum CalendarPickerType { Dates, Weeks, Months, NumberOrder, TimeRange }

const lastDayMonth = AppLocalization.Label63;
const lastOrder = AppLocalization.Label62;

@Component({
    selector: 'rom-calendar-picker-ro5',
    templateUrl: './calendar-picker-ro5.component.html',
    styleUrls: ['./calendar-picker-ro5.component.less']
})
export class CalendarPickerRo5Component implements OnInit {

    months = Constants.CALENDAR_RU.monthNames as string[];
    weeks = Constants.CALENDAR_RU.dayNamesShortAlt as string[];
    days: number[] = [];
    orderNumbers: number[] = [];
    timeRanges: string[] = [];

    monthsTable: string[] = [];
    weeksTable: string[] = [];
    daysTable: number[] = [];
    timeRangesTable: string[] = [];

    lastDayMonth = lastDayMonth;
    lastOrder = lastOrder;

    calendarPickerTypes = CalendarPickerType;
    @Input() calendarPickerType = CalendarPickerType.Dates;

    // результат, куда складываются значения
    private _values: number[];
    @Output() valuesChange = new EventEmitter();
    @Input()
    get values() {
        return this._values;
    }
    set values(value: number[]) {
        this._values = [...value];
        this.valuesChange.emit(this._values);
    }

    constructor() { }

    ngOnInit() {
        
        const recSplice = (tar: any[], source: any[], count: number) => {
            tar.push(source.splice(0, count));
            if (source.length) {
                recSplice(tar, source, count);
            }
        }

        if (this.calendarPickerType === CalendarPickerType.Months) {
            recSplice(this.monthsTable, [...this.months], 3);
        } else if (this.calendarPickerType === CalendarPickerType.Dates) {
            for (let i = 1; i <= 31; i++) {
                this.days.push(i);
            }
            this.days.push(-1);
            recSplice(this.daysTable, [...this.days], 7);
        } else if (this.calendarPickerType === CalendarPickerType.NumberOrder) {
            for (let i = 1; i <= 4; i++) {
                this.orderNumbers.push(i);
            }
            this.orderNumbers.push(-1);
        } else if (this.calendarPickerType === CalendarPickerType.Weeks) {
            // recSplice(this.weeksTable, this.weeks, 3);
        } else if (this.calendarPickerType === CalendarPickerType.TimeRange) {
            for (let i = 1; i < 25; i++) {
                const range = this.doubleDigit(`${i-1}`) + ' - ' + this.doubleDigit(`${i}`)
                this.timeRanges.push(range)             
            }
            recSplice(this.timeRangesTable, [...this.timeRanges], 6)
        }
    }

    set(val: number | string) {
        this.values = this.values || [];
        if (!this.isSelect(val)) {
            const index = this.getIndex(val);
            this.values.push(index);
        } else {
            if (typeof val === 'string') {
                val = this.getIndex(val);
            }
            this.values.splice(this.values.findIndex(x => x === val), 1);
        }
    }

    isSelect(val: number | string) {
        if (typeof val === 'string') {
            val = this.getIndex(val);
        }
        return (this.values || []).find(x => x === val) != null;
    }

    private getIndex(val: number | string) {
        if (this.calendarPickerType === CalendarPickerType.Months) {
            return this.months.findIndex(x => x === val) + 1;
        } else if (this.calendarPickerType === CalendarPickerType.Dates) {
            if (val === -1) {
                return val;
            }
            return this.days.findIndex(x => x === val) + 1;
        } else if (this.calendarPickerType === CalendarPickerType.NumberOrder) {
            if (val === -1) {
                return val;
            }
            return this.orderNumbers.findIndex(x => x === val) + 1;
        } else if (this.calendarPickerType === CalendarPickerType.Weeks) {
            return this.weeks.findIndex(x => x === val) + 1;
        } else if (this.calendarPickerType === CalendarPickerType.TimeRange) {
            return this.timeRanges.findIndex(x => x === val) + 1;
        }

        return -1;
    }

    private doubleDigit(digit: string) {
        const digDouble = digit.length > 1 ? digit : '0' + digit;
        return digDouble + ':' + '00';
    }
}