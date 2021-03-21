import { Component, Input, Output, EventEmitter, ViewChild, AfterViewInit, OnInit, HostListener } from '@angular/core';
import * as Constants from '../../common/Constants';
import { Utils } from '../../core';

import { NgbTimeToStringAdapter, NgbDatepickerI18nEx, NgbDateParserFormatterEx, NgbDateAdapterEx } from './models/index';
import { NgbInputDatepicker, NgbDatepickerI18n, NgbDateAdapter, NgbTimeAdapter, NgbDateNativeAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';

declare var $: any;

const calendarDialogHeight = 303;

enum DialogType {
    Time = 0,
    Date = 1,
    Month = 2,
    Year = 3,
}

@Component({
    selector: 'date-picker-ngb-ro5',
    templateUrl: 'DatePickerNgb.html',
    styleUrls: ['DatePickerNgb.less'],
    providers: [
        { provide: NgbDatepickerI18n, useClass: NgbDatepickerI18nEx },
        { provide: NgbDateAdapter, useClass: NgbDateAdapterEx },
        { provide: NgbTimeAdapter, useClass: NgbTimeToStringAdapter },
        { provide: NgbDateParserFormatter, useClass: NgbDateParserFormatterEx }
    ]
})

export class DatePickerNgb implements OnInit, AfterViewInit {

    @ViewChild('dpFrom', { static: true }) ngbInputDatepickerFrom: NgbInputDatepicker;
    @ViewChild('dpTo', { static: true }) ngbInputDatepickerTo: NgbInputDatepicker;

    @Input() isVertical = false;//положение двух контролов Datepicker: DateStart, DateEnd
    @Input() isDefFast = true;//устанавливает значение по умолчанию, выбран: последний месяц
    @Input() fastPanel = false;//отображает панель быстрой установки дат
    @Input() isTimeShow = true;//отображает календарь с timepicker
    
    @Input() isIntervalMode = true;//указывает, на отображение двух контролов Datepicker: DateStart, DateEnd
    @Input() isMonthMode = false;//режим выбора месяца

    @Input() isNotEmpty: boolean = true;
    @Input() positionCalendar: string = 'bottom';//def bottom, top
    @Input() positionDiv: string;//absolute, fixed
    private min1: any;
    private max1: any;
    private min2: any;
    private max2: any;
    private __min: any;
    @Input()
    get min() {
        return this.__min;
    }
    set min(val: any) {
        if (val != null) {
            this.min1 = this.min2 = val;
        }
        this.__min = val;
    }
    private __max: any;
    @Input()
    get max() {
        return this.__max;
    }
    set max(val: any) {
        if (val != null) {
            this.max1 = this.max2 = val;
        }
        this.__max = val;
    }

    private _fromDateDefault: any;
    private _fromDate: any;
    @Input()
    get fromDate(): any {
        return this._fromDate;
    }
    set fromDate(val: any) {
        if (val != null /*&& !this._fromDateDefault*/) { if (typeof val === "string") this._fromDateDefault = new Date(val); else this._fromDateDefault = val; }
        this._fromDate = val;

        this.min2 = val;

        this.fromDateChange.emit(this._fromDate);

        (<any>this.ngbInputDatepickerFrom)._dateAdapter.dateFormatter =
            (<any>this.ngbInputDatepickerFrom)._parserFormatter;
        (<any>this.ngbInputDatepickerFrom)._parserFormatter.dateGlobal = this.fromDate;
    }
    private _toDateDefault: any;
    private _toDate: any;
    @Input()
    get toDate(): any {
        return this._toDate;
    }
    set toDate(val: any) {
        if (val != null /*&& !this._toDateDefault*/) { if (typeof val === "string") this._toDateDefault = new Date(val); else this._toDateDefault = val; }
        this._toDate = val;

        if (!this.isMonthMode) {
            this.max1 = val;
        }

        this.toDateChange.emit(this._toDate);

        (<any>this.ngbInputDatepickerTo)._dateAdapter.dateFormatter =
            (<any>this.ngbInputDatepickerTo)._parserFormatter;
        (<any>this.ngbInputDatepickerTo)._parserFormatter.dateGlobal = this.toDate;
    }



    @Output() fromDateChange = new EventEmitter<any>();
    @Output() toDateChange = new EventEmitter<any>();
    @Output() onInit = new EventEmitter<any>();

    readonly ru = Constants.Common.Constants.CALENDAR_RU;
    formatDate: string;

    public id: string;

    ngOnInit(): void {
        if (!this.id) this.id = this.generateUniqueId().toString();

        //default date
        if (this.isDefFast) {
            setTimeout(() => {
                if (this.fromDate == null && this.toDate == null) {
                    this.setFastDate(3);
                }                
            }, 200);           
        }

        if (this.isMonthMode) {
            this.isTimeShow = false;

            this.formatDate = Constants.Common.Constants.DATE_FMT_YEAR_MONTH;
        } else {
            this.formatDate = this.isTimeShow
                ? Constants.Common.Constants.DATE_TIME_FMT
                : Constants.Common.Constants.DATE_FMT;
        }

        this.onInit.emit({ fromDate: this.fromDate, toDate: this.toDate });
    }

    ngAfterViewInit(): void {
        
    }

    private getFormatDate(date: string) {
        let year_index = 3;
        let matches: any =
            /^(\d{1,2})[-/.\/](\d{1,2})[-/.\/](\d{4})(?:.+?(\d{1,2}:?(\d{1,2}:?(\d{1,2}?)?)?)?)?$/.exec(date);
        if (matches == null) {
            year_index = 1;
            matches =
                /^(\d{4})[-/.\/](\d{1,2})[-/.\/](\d{1,2})(?:.+?(\d{1,2}:?(\d{1,2}:?(\d{1,2}?)?)?)?)?$/.exec(date);
            if (matches == null) {
                return null;
            }
        }
        let D = matches[year_index === 3 ? 1 : 3];
        let M = matches[2] - 1;
        let Y = matches[year_index];

        let time_item: any[] = [0, 0, 0];
        if (matches[4]) {
            for (let i = 0; i < matches[4].split(':').length; i++) {
                time_item[i] = matches[4].split(':')[i];
            }
        }
        let composedDate = new Date(Y, M, D, time_item[0], time_item[1], time_item[2]);
        if (composedDate.toString() !== "Invalid Date") {
            return composedDate;
        }
        else {
            return null;
        }
    }

    public setFastDate(type: number) {
        let date = new Date(); // now
        date.setDate(date.getDate() - 1);

        if (type === 1) {
            this.fromDate = date; // now - 1 day
            this.toDate = new Date(date); // now - 1 day
        }
        else if (type === 2) {
            date = new Date();
            date.setDate(date.getDate() - date.getDay() - 6);
            this.fromDate = date;
            date = new Date();
            date.setDate(date.getDate() - date.getDay());
            this.toDate = date;
        }
        else if (type === 3) {
            date = new Date();
            //this.fromDate = new Date(date.getFullYear(), date.getMonth() - 1, 1);
            //date = new Date(date.getFullYear(), date.getMonth(), 1);
            //this.toDate = new Date(new Date().setDate(date.getDate() - 1));
            this.fromDate = new Date(new Date().setDate(date.getDate() - 30));
            this.toDate = date;
        }
        else if (type === 4) {
            //date = new Date();
            //this.fromDate = new Date(date.getFullYear(), date.getMonth() - 1, 1);
            //this.toDate = new Date(date.getFullYear(), date.getMonth(), 1);
            date = new Date();
            this.fromDate = new Date(date.getFullYear(), date.getMonth() - 1, 1);
            date = new Date(date.getFullYear(), date.getMonth(), 1);
            this.toDate = new Date(new Date().setDate(date.getDate() - 1));
        }
        this.fromDate.setHours(0);
        this.fromDate.setMinutes(0);
        this.fromDate.setSeconds(0); // now - 1 day - 0h - 0m - 0s
        this.fromDate.setMilliseconds(0); // now - 1 day - 0h - 0m - 0s

        this.toDate.setDate(this.toDate.getDate() + 1);
        this.toDate.setHours(0);
        this.toDate.setMinutes(0);
        this.toDate.setSeconds(0); // now - 0h - 0m - 0s
        this.fromDate.setMilliseconds(0); // now - 1 day - 0h - 0m - 0s
    }

    private generateUniqueId() {
        let fnc = (min: number, max: number) => {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
        return Date.now() + fnc(10, 100);
    }

    public openCloseNgbPicker(d: any) {
        if (d.isDialogOpen) {
            d.close();
            d.isDialogOpen = false;
        } else {
            d.toggle();
            d.isDialogOpen = true;
        }
    }

    private clickTouchDocument() {
        if (this.ngbInputDatepickerFrom.isOpen()) {
            this.openCloseNgbPicker(this.ngbInputDatepickerFrom);
        }
        if (this.ngbInputDatepickerTo.isOpen()) {
            this.openCloseNgbPicker(this.ngbInputDatepickerTo);
        }
    }

    @HostListener('document:click')
    documentClick() {
        this.clickTouchDocument();
    }
    @HostListener('document:touchstart')
    documentTouch() {
        this.clickTouchDocument();
    }
}
