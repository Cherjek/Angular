import { Component, OnInit, Output, Input, EventEmitter, ElementRef, ViewChild, HostListener, forwardRef } from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, FormControl, Validator } from '@angular/forms';

import * as Localization from "../../common/Localization";
import Locale = Localization.Common.Localization;

const MAX_LENGTH_INPUTBOX = 256;
const MAX_LENGTH_NUMBERBOX = 17;

@Component({
    selector: 'input-box',
    templateUrl: './InputBox.html',
    styleUrls: ['./InputBox.css'],
    providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputBox),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => InputBox),
      multi: true,
    }]
})
export class InputBox implements OnInit,
    ControlValueAccessor, Validator {

    constructor() { }

    @Output() valueChange = new EventEmitter<string | number>();
    @Output() isCheckValidValue = new EventEmitter<boolean>();
    @Output() onCursorBlur = new EventEmitter<any>();

    @Input() readonly: string;
    @Input() isFocus: boolean = false;//��������� �� ������������� � ������ input ��� �������� �����
    @Input() isFullSize: boolean = false;//��������� �� ��� InputBox ��� ����� � height: 100%, ������: ��� header ����� ������ "�����"
    @Input() maxlength: number;
    @Input() type: string = 'text'; //text - default | number | float | search | password (email | phone - �� �����������)
    @Input() placeholder: string;
    @Input() min: number;
    @Input() max: number;
    @Input() isEnableValidate: boolean;
    @Input() isNotValidValue: boolean;//�������� ������������� ������� ������ � �������� ����������
    private _value: string;
    @Input()
    get value() {
        return this._value;
    }
    set value(val: string) {
        this._value = val;
    }

    @ViewChild('Input', { static: true }) inputView: ElementRef;

    private downCaretClicked: boolean;
    public isInputFocus: boolean;//��������� ��������, ����� ��� ����������� ������ clear
    public isInputHover: boolean;//��������� ��������, ����� ��� ����������� ������ clear
    private timer: any;
    private timeout: any;
    public get typeDefault() {
        if (this.type === 'password' || this.type === 'time') return this.type;
        else return 'text';
    }



    ngOnInit() {
        if (this.isFocus) this.inputView.nativeElement.focus();
        if (this.type === "search") this.placeholder = Locale.Form.Search + "...";
        if (this.maxlength == null) {
            if (this.isNumberType) this.maxlength = MAX_LENGTH_NUMBERBOX;
            else this.maxlength = MAX_LENGTH_INPUTBOX;
        }
    }
    
    /*@HostListener('window:mousedown', ['$event'])*/ onMouseSpinnerDown(event: KeyboardEvent, val: number) {
        this.downCaretClicked = true; // ��������� ��� ������ ������� �������
        this.timerMouseDownValInc(val);
    }

    /*@HostListener('window:mouseup', ['$event'])*/ onMouseSpinnerUp(event: KeyboardEvent, val: number) {

        this.timerMouseDownValInc(val, true);
        this.focus();
    }

    focus() {
        this.inputView.nativeElement.focus();
    }

    isValid() {
        let isValid = this.value != null && `${this.value}`.length > 0;
        this.isNotValidValue = !isValid;
        return isValid;
    }

    inputChange(val: any) {
        val.target.value = this.value;
    }

    modelChange(val: any) {

        //��������� �� ������������ ��������� ��������
        //���� ����� ������� ����� ��� ����� ctrl+v, ����������� ��� ����������
        if (this.isNumberType) {
            if (val != null && `${val}`.length) {
                let result: any = Number(val);

                if (isNaN(result)) {
                    if (this.value == null) val = '';
                    else {
                        val = this.value;
                    }
                }
                else {
                    if (this.min != null && ("" + this.min) != "") {
                        if (result < this.min) val = this.min;
                    }
                    if (this.max != null && ("" + this.max) != "") {
                        if (result > this.max) val = this.max;
                    }

                    if (result > Number.MAX_SAFE_INTEGER) val = Number.MAX_SAFE_INTEGER;
                }
            }
        }

        if (this.isEnableValidate) {
            let isValid = val != null && `${val}`.length > 0;
            this.isNotValidValue = !isValid;
            this.isCheckValidValue.emit(isValid);
        }

        this.valueChange.emit(val != null && `${val}`.length > 0 ? val : null);
    }

    private valNumberInc(val: number) {
        let result: any = Number(this.value || 0);

        result = result + val;
        if (!isNaN(result)) {
            this.modelChange(result);
        }
    }

    public timerMouseDownValInc(val: number, isEnd: boolean = false) {

        if (isEnd) {
            clearTimeout(this.timeout);
            clearInterval(this.timer);
            delete this.timeout;
            delete this.timer;
        }
        else {
            if (val !== 0) {
                let func = () => {
                    this.valNumberInc(val);
                }
                func();

                this.timeout = setTimeout(() => {
                    this.timer = setInterval(() => {
                        func();
                    }, 100);
                }, 600);
            }
        }
    }

    private isNumberKey(event: any) {
        if (this.isNumberType) {
            var charCode = (event.which) ? event.which : event.keyCode;
            return !((this.isNumberFloat ? charCode !== 46/* . */ : true) && charCode > 31 && (charCode < 48 || charCode > 57));
        }
        else
            return true;
    }

    public get isNumberType() {
        return this.type === 'number' || this.type === 'float';
    }

    private get isNumberNumber() {
        return this.type === 'number';
    }

    private get isNumberFloat() {
        return this.type === 'float';
    }

    private get isTextType() {
        return this.type === 'text';
    }

    public inputChecked(event: any) {
        return this.isNumberKey(event);
    }

    public onBlur() {
        this.onCursorBlur.emit(this.value);
    }

    private checkCaretDownClicks(event: any) {
        if (this.downCaretClicked) { // ��������� ��� ������ ������� �������
            event.preventDefault(); // ����� ������ ���� ����� �� �������� �� ��������� � �� �������� onBlur()-�����
            this.downCaretClicked = false;
        }
    }

    public onMouseInputBoxDown(event: any) {
        this.checkCaretDownClicks(event);
    }


    /*
     *
     * VALIDATION
     *
     */
    private data: any;

    // this is the initial value set to the component
    public writeValue(obj: any) {
        if (obj) {
            this.data = obj;
        }
    }

    // registers 'fn' that will be fired wheb changes are made
    // this is how we emit the changes back to the form
    public registerOnChange(fn: any) {
        this.propagateChange = fn;
    }

    // validates the form, returns null when valid else the validation object
    // in this case we're checking if the json parsing has passed or failed from the onChange method
    public validate(c: FormControl): any {
        return null;
    }

    // not used, used for touch input
    public registerOnTouched() { }

    // change events from the textarea
    public onChange(event: any) {

        // get value from text area
        this.data = event;//.target.value;

        // update the form
        this.propagateChange(this.data);
    }

    // the method set in registerOnChange to emit changes back to the form
    private propagateChange = (_: any) => { };
}
