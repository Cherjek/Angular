import { Component, Input, Output, EventEmitter, ViewChild, AfterViewInit, OnInit, ElementRef, Renderer2 } from '@angular/core';
import * as Constants from '../../common/Constants';
import { Utils } from '../../core';

declare var $: any;

const calendarDialogHeight = 303;

enum DialogType {
    Time = 0,
    Date = 1,
    Month = 2,
    Year = 3,
}

@Component({
    selector: 'date-picker-ro5',
    templateUrl: 'DatePicker.html',
    styleUrls: ['DatePicker.less']
})

export class DatePicker implements OnInit, AfterViewInit {

    @Input() isVertical = false;//положение двух контролов Datepicker: DateStart, DateEnd
    @Input() isDefFast = true;//устанавливает значение по умолчанию, выбран: последний месяц
    @Input() fastPanel = false;//отображает панель быстрой установки дат
    @Input() isTimeShow = true;//отображает календарь с timepicker
    
    @Input() isIntervalMode = true;//указывает, на отображение двух контролов Datepicker: DateStart, DateEnd
    @Input() isMonthMode = false;//режим выбора месяца

    @Input() isNotEmpty: boolean = true;
    @Input() positionCalendar: string = 'bottom';//def bottom, top
    @Input() positionDiv: string;//absolute, fixed
    @Input() fastButtonType = 3;
    public min1: any;
    public max1: any;
    public min2: any;
    public max2: any;
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
    }
    private _toDateDefault: any;
    private _toDate: any;
    @Input()
    get toDate(): any {
        return this._toDate;
    }
    set toDate(val: any) {
        if (!this.isIntervalMode) return;
        if (val != null /*&& !this._toDateDefault*/) { if (typeof val === "string") this._toDateDefault = new Date(val); else this._toDateDefault = val; }
        this._toDate = val;

        if (!this.isMonthMode) {
            this.max1 = val;
        }

        this.toDateChange.emit(this._toDate);
    }
    @Output() fromDateChange = new EventEmitter<any>();
    @Output() toDateChange = new EventEmitter<any>();
    @Output() onInit = new EventEmitter<any>();

    @ViewChild('owlDateStart', { static: true }) owlDateStart: any;
    @ViewChild('owlDateEnd', { static: false }) owlDateEnd: any;
    @ViewChild('activeElement', { static: false }) activeElement: Element;

    readonly ru = Constants.Common.Constants.CALENDAR_RU;
    formatDate: string;

    public id: string;

    ngOnInit(): void {
        if (!this.id) this.id = this.generateUniqueId().toString();

        //default date
        if (this.isDefFast) {
            setTimeout(() => {
                if (this.fromDate == null && this.toDate == null) {
                    this.setFastCalendarDate(this.fastButtonType);
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
        if (this.isMonthMode) {
            this.initMonthMode();
        }
        this.initPrototypeMethod();
    }

    constructor(private el: ElementRef, private renderer2: Renderer2) {}

    private initPrototypeMethod() {
        this.owlDateStart.getFormatDate = this.getFormatDate;
        this.owlDateStart.onInputUpdate = this.DateTimePickerComponent_prototype_onInputUpdate;
        this.owlDateStart.show = this.DateTimePickerComponent_prototype_show;
        this.owlDateStart.alignDialog = this.DateTimePickerComponent_prototype_alignDialog;
        if (this.owlDateEnd) {
            this.owlDateEnd.getFormatDate = this.owlDateStart.getFormatDate;
            this.owlDateEnd.onInputUpdate = this.owlDateStart.onInputUpdate;
            this.owlDateEnd.show = this.owlDateStart.show;
            this.owlDateEnd.alignDialog = this.owlDateStart.alignDialog;
        }
    }

    private initMonthMode() {
        this.owlDateStart.presetDialogType = DialogType.Month;

        this.owlDateStart.changeDialogType = (type: number) => {
            if (this.owlDateStart.dialogType === type) {
                this.owlDateStart.dialogType = DialogType.Month;
                return;
            }
            else {
                this.owlDateStart.dialogType = type;
            }
            if (this.owlDateStart.dialogType === DialogType.Year) {
                this.owlDateStart.generateYearList();
            }
        };
        this.owlDateStart.selectMonth = (month: number) => {
            this.owlDateStart.onSelectDate(null, new Date(parseInt(this.owlDateStart.pickerMoment.getFullYear()), month, 1));
        };
        this.owlDateStart.selectYear = (year: number) => {
            this.owlDateStart.pickerMoment = new Date(this.owlDateStart.pickerMoment.setYear(year));
            this.owlDateStart.generateCalendar();
            this.owlDateStart.changeDialogType(2);
        };
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

    onBlur(event: any, valElement: number) {
        if (this.isNotEmpty) {
            if (valElement === 1) {
                if (this.fromDate == null) this.fromDate = this._fromDateDefault;
            }
            else if (valElement === 2) {
                if (this.toDate == null) this.toDate = this._toDateDefault;
            }
        }
    }

    onFocus(event: any, valElement: number) {

        $(event.target).on("keydown",
            (e: any) => {
                if (e.keyCode == 67 && (e.ctrlKey || e.metaKey)) {
                    //it was Ctrl + C (Cmd + C)
                } else if (e.keyCode == 86 && (e.ctrlKey || e.metaKey)) {
                    //it was Ctrl + V (Cmd + V)

                    setTimeout(
                        () => {

                            let date: any = $(event.target).val();

                            if (new Date(date).toString() !== "Invalid Date") {
                                date = new Date(date);
                            } else {
                                date = this.getFormatDate(date);
                            }
                            if (this.isNotEmpty) {
                                if (date == null) {
                                    if (valElement === 1) {
                                        date = this._fromDateDefault;
                                    } else {
                                        date = this._toDateDefault;
                                    }

                                    event.target.value = new Utils.DateFormat().getDateTime(date);
                                }
                            }

                            if (valElement === 1) {
                                this.fromDate = date;
                            } else {
                                this.toDate = date;
                            }

                        },
                        100);
                }
            });

        //костыль для появления окна с календарем на уровне body, иначе перекрывается другими формами
        let offset = $(event.target).offset();
        let inputHeight = event.target.clientHeight;        

        let winHeight = $(window).height();
        let topOffset = winHeight - (offset.top + inputHeight + calendarDialogHeight);
        //console.log("offset.top: " + offset.top + ", event.target.height: " + inputHeight + ", window.height: " + $(window).height() + ", topOffset: " + topOffset);
        let popup = $(event.target.parentElement.parentElement).find('.owl-dateTime-dialog');
        /*if (topOffset < 0) {
            let isScrollParentClass: boolean = false;
            let parents = $(event.target).parentsUntil("virtual-scroller");
            if (parents.length) {
                let parent = parents[parents.length - 1];
                isScrollParentClass = (parent.className === "scrollable-content");
            }

            if (isScrollParentClass) {
                $(popup).css({ 'position': 'absolute' });

                $(popup).css({ 'top': "-" + calendarDialogHeight + 'px' });
            }
            else {
                $(popup).css({ 'position': 'absolute' });

                let bottomPopup = offset.top + inputHeight + topOffset;
                let diffWinInputOffset = winHeight - offset.top;
                //console.log("bottomPopup: " + bottomPopup + ", diffWinInputOffset: " + diffWinInputOffset);

                $(popup).css({ 'top': parseInt(bottomPopup) - diffWinInputOffset + 'px' });
            }            
        }
        else {
            $(popup).css({ 'position': 'fixed' });
        }*/
        if (this.positionCalendar === 'top') {
            $(popup).css({ 'top': "-" + calendarDialogHeight + 'px' });
        }
        if (this.positionDiv != null) {
            $(popup).css({ 'position': this.positionDiv });
        }
    }

    private setFastCalendarDate(type: number) {
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
        this.fromDate.setMilliseconds(0);

        if(this.toDate) {
            this.toDate.setDate(this.toDate.getDate() + 1);
            this.toDate.setHours(0);
            this.toDate.setMinutes(0);
            this.toDate.setSeconds(0); // now - 0h - 0m - 0s
            this.toDate.setMilliseconds(0);
        }
    }

    public setFastDate(type: number) {
        this.fastButtonType = type;
        this.setFastCalendarDate(type);
    }

    private generateUniqueId() {
        let fnc = (min: number, max: number) => {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
        return Date.now() + fnc(10, 100);
    }

    /*
     *
     * CUSTOM JS FUNCTION
     * 
     */

    private DateTimePickerComponent_prototype_onInputUpdate = function (event: any) {
        this.inputValueChanged = true;
        var composedDate = null;
        //correct string value
        if (typeof event.target.value === "string") {
            var date = event.target.value;
            composedDate = this.getFormatDate(date);
        }
        let parseValueFromString = (date: string) => {
            //Edge и Firefox не понимают формат 2018.09, нужно приводить к формату ISO 8601
            date = date.replace('.', '');
            date = date.replace('/', '');
            date = date.replace('-', '');
            if (date.length === 6) date += "01";

            return this.parseValueFromString(date);
        }
        var value = composedDate || parseValueFromString(event.target.value);
        if (!value) {
            this.value = null;
        }
        else if (this.isSingleSelection()) {
            if (!this.isValidValue(value)) {
                value = null;
            }
            this.value = value;
            this.updateCalendar(this.value);
            this.updateTimer(this.value);
        }
        else if (this.isMultiSelection()) {
            for (var i = 0; i < value.length; i++) {
                if (!this.isValidValue(value[i])) {
                    value[i] = null;
                }
            }
            this.value = value;
            this.updateCalendar(this.value[0]);
            this.updateTimer(this.value[0]);
        }
        else if (this.isRangeSelection()) {
            for (var i = 0; i < value.length; i++) {
                if (!this.isValidValue(value[i])) {
                    value[i] = null;
                }
            }
            if (value[0] && value[1] && eval("date_fns_1.isAfter(value[0], value[1])")) {
                value[1] = null;
            }
            this.value = value;
            this.updateCalendar(this.value[0]);
            this.updateTimer(this.value[0]);
        }
        this.updateModel(this.value);
    };

    private DateTimePickerComponent_prototype_show = function (event: any) {
        this.alignDialog();
        this.dialogVisible = true;
        this.dialogType = this.presetDialogType || DialogType.Date;
        this.bindDocumentClickListener();
        return;
    };

    private DateTimePickerComponent_prototype_alignDialog = function () {
        var element = this.dialogElm.nativeElement;
        var target = this.containerElm.nativeElement;
        var elementDimensions = element.offsetParent ? {
            width: element.offsetWidth,
            height: element.offsetHeight
        } : this.getHiddenElementDimensions(element);
        var targetHeight = target.offsetHeight;
        var targetWidth = target.offsetWidth;
        var targetOffset = target.getBoundingClientRect();
        var viewport = this.getViewport();
        var top, left;
        if ((targetOffset.top + targetHeight + elementDimensions.height) > viewport.height) {
            top = -1 * (elementDimensions.height);
            if (targetOffset.top + top < 0) {
                top = 0;
            }
        }
        else {
            top = targetHeight;
        }
        if ((targetOffset.left + elementDimensions.width) > viewport.width)
            left = targetWidth - elementDimensions.width;
        else
            left = 0;
        //element.style.top = top + 'px';
        //element.style.left = left + 'px';
    };
}
