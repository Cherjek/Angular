import {
    Component, Input, Output, EventEmitter, ViewChild, OnInit, OnChanges, SimpleChanges, SimpleChange,
    HostListener, ElementRef
} from '@angular/core';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, merge, map, filter } from 'rxjs/operators';

declare var $: any;

@Component({
    selector: 'combo-box-ro5',
    templateUrl: 'ComboBox.html',
    styleUrls: ['ComboBox.css']
})

export class ComboBox implements OnInit, OnChanges {

    constructor(private elementRef: ElementRef) {}

    model: string;
    @Input() value: any;
    @Input() keyField: string;
    @Input() valueField: string;
    @Input() itemsInput: any[];
    @Input() placeholder = "Не установлено";
    @Input() isReadonly = false;
    public controlId: string;
    public asyncStart = false;
    placeholderTwo: string;

    @ViewChild('instance', { static: true }) instance: NgbTypeahead;
    focus$ = new Subject<string>();
    click$ = new Subject<string>();

    @Output() event = new EventEmitter<any>();
    @Output() onSelected = new EventEmitter<any>();

    valueChange = false;

    ngOnInit() {
        this.controlId = "comboBox_" + this.generateUniqueId();
    }
    ngOnChanges(sc: SimpleChanges) {
        if (sc.itemsInput) {
            if (this.asyncStart &&
                (<SimpleChange>sc.itemsInput).previousValue == null &&
                (<SimpleChange>sc.itemsInput).currentValue != null) {
                //загрузка значений произошла
                this.asyncStart = false;
                this.reopenPopover();
            }
        }
        if (sc.value) {
            if ((<SimpleChange>sc.value).currentValue != null) {
                this.model = (<SimpleChange>sc.value).currentValue[this.valueField];
            } else
                this.model = null;
        }
    }

    private generateUniqueId() {
        let fnc = (min: number, max: number) => {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
        return Date.now() + fnc(10, 100);
    }

    search = (text$: Observable<string>) =>
        text$
            .pipe(
                debounceTime(200),
                distinctUntilChanged(),
                merge(this.focus$),
                merge(
                    this.click$.pipe(filter(() => !this.instance.isPopupOpen()))
                ),
                map((term: any) => 
                  {
                    if (typeof term === 'string') {
                      if (term == null || term === '') return this.itemsInput;
                      return this.filterDropDownItems(term);
                    } else {
                      if (term.event == null || term.event === '') return this.itemsInput;
                      return this.filterDropDownItems(term.event, true);
                    }
                  }
                )
            );
    formatter = (x: any) => x[this.valueField];
            
    private filterDropDownItems(term: string, withVal?: boolean) {
        const compare = (val: number) => {
            if (this.valueChange) {
                return val > -1;
            } else {
                return val < 0;
            }
        }
        return (this.itemsInput || []).filter((comboItem: any) => {
          const valItem = (comboItem[this.valueField] || '').toLowerCase();
          if (withVal) {
            if (valItem.length !== term.length) return -1;
          }
          return compare(valItem.indexOf(term.toLowerCase()));          
        });
    }

    public selectItem(event: any) {
        let value = event != null ? event.item : null;
        //не давать выбрать, если этот элемент уже выбран
        if (this.value != null && value != null && this.value[this.keyField] === value[this.keyField]) {
            event.preventDefault();
            return;
        } else if (value == null) {
            this.placeholderTwo = null;
        }
        this.onSelected.emit(value);
        setTimeout(() => this.valueChange = false);
    }

    public focus() {
        if (this.itemsInput == null) {
            this.asyncStart = true;
            this.event.emit({ comboBox: this, event: 'LOAD_TRIGGER' });
        }
    }

    public reopenPopover() {
        this.instance.dismissPopup();
        let inputNative = (<any>this.instance)._elementRef.nativeElement;
        inputNative.blur();
        setTimeout(() => inputNative.focus(), 50);
    }

    public modelChange() {
        if (this.model != null && !this.model.length) {
            if (this.value) {
                this.placeholderTwo = this.value[this.valueField];
            }
        }
    }

    hideTypeAhead() { // скрываем выпадающий список
        if (this.instance.isPopupOpen()) {
            this.instance.dismissPopup();
        }
    }

    @HostListener('window:wheel', ['$event']) onScroll(event: any) { // при скролле колесика мышки
        this.reclose(event, true);
    }

    @HostListener('window:resize') onResize() { // при ресайзе вьюпорта
        this.hideTypeAhead();
    }

    @HostListener('window:mousedown', ['$event']) onMouseDown(event: any) { // при скролле самого ползунка-скролла
        this.reclose(event);
    }

    private reclose(event: any, isWheel?: boolean) {

        if (this.instance.isPopupOpen()) {
            let inputBoxMeasures: any = this.elementRef.nativeElement.getBoundingClientRect();
            // область инпут-бокса
            let ibX1: number = inputBoxMeasures.left;
            let ibX2: number = inputBoxMeasures.right;
            let ibY1: number = inputBoxMeasures.top;
            let ibY2: number = inputBoxMeasures.bottom;

            let typeAheadMeasures: any = document.getElementsByTagName('ngb-typeahead-window')[0].getBoundingClientRect();
            // область выпадающего списка
            let taX1: number = typeAheadMeasures.left;
            let taX2: number = typeAheadMeasures.right;
            let taY1: number = typeAheadMeasures.top;
            let taY2: number = typeAheadMeasures.bottom;

            // координаты клика
            let X: number = event.pageX;
            let Y: number = event.pageY;

            let reclose1 = () => {
                if (((X < ibX1 || X > ibX2) || (Y < ibY1 || Y > ibY2)) && // клик за пределами инпут-бокса
                    ((X < taX1 || X > taX2) || (Y < taY1 || Y > taY2))) { // и за пределами выпадающего списка
                    this.instance.dismissPopup();
                }
            }

            let reclose2 = () => {
                if (((X < taX1 || X > taX2) || (Y < taY1 || Y > taY2))) { // скролл за пределами выпадающего списка
                    this.instance.dismissPopup();
                }
            }

            if (isWheel) reclose2();
            else reclose1();
        }

    }
}