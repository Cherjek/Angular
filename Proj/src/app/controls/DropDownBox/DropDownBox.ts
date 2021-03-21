import { ListItem } from './../ListView/ListView';
import {
    Component, Input, Output, EventEmitter, ViewEncapsulation, ViewChild, OnInit, OnChanges, SimpleChanges,
    SimpleChange, TemplateRef, ElementRef, AfterViewInit, AfterContentChecked, DoCheck
} from '@angular/core';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject } from 'rxjs';
//import { debounceTime, distinctUntilChanged, merge, map, filter } from 'rxjs/operators';
import { ListView } from "../ListView/ListView";

declare var $: any;

const ListHeight = 300;

@Component({
    selector: 'dropdown-box-ro5',
    templateUrl: 'DropDownBox.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['DropDownBox.less']
})

export class DropDownBox implements OnInit, AfterContentChecked, AfterViewInit, DoCheck {
    @ViewChild('rightPart', { static: true }) rightPart: ElementRef;

    @Input() keyField: string;
    @Input() valueField: string;
    @Input() additionalField: string;
    @Input() checkOnOpenItems: any[];
    
    private _itemsInput: any[];
    @Input() 
    get itemsInput(): any[] {
        return this._itemsInput;
    }
    set itemsInput(val: any[]) {
        if (val != null) {
            if (this.asyncStart) {
                this.asyncStart = false;
                
                setTimeout(() => this.viewPopover());
            }
        }
        this._itemsInput = val;
    }

    @Input() isSelected: boolean;
    @Input() footerTemplate: TemplateRef<any>;
    @Input() buttonText: string = '---';
    @Input() ListHeight: number = ListHeight; // высота выпадающего списка
    @Input() BttnColorClass: string = 'btn-outline-secondary';
    @Input() autoClose: string | boolean = 'outside';

    private controlId: string;
    public asyncStart: boolean = false;
    @ViewChild('popover', { static: true }) popover: any;
    @ViewChild(ListView, { static: false }) listView: ListView;
    
    @Output() event = new EventEmitter<string>();
    @Output() cacheCallback = new EventEmitter<any>();
    @Output() itemEvent = new EventEmitter<any>(); // to get selected item in non-checkbox dropdown

    ngOnInit() {
        this.controlId = "dropDownBox_" + this.generateUniqueId();
    }

    ngAfterViewInit() {}
    ngAfterContentChecked() {}
    ngDoCheck() {
        if (this.checkOnOpenItems && this.checkOnOpenItems.length && this.listView) {
            const toStr = (obj: any) => JSON.stringify(obj);
            this.listView.DataSource.forEach((item: any) => {
                if (!item.isProcessed && this.checkOnOpenItems.some(x => toStr(x) === toStr(item.Data))) {
                    item.IsCheck = true;
                    item.isProcessed = true;
                }
            });
        }
    }

    correctPlacement(footerHeight?: number) { //высота футера
        let DropDownBoxMetrics: any = this.rightPart.nativeElement.getBoundingClientRect();

        if ((window.innerHeight/*выста вьюпорта*/ - DropDownBoxMetrics.bottom/*расстояние от нижнего края дропбокса до верхнего края вьюпорта*/) < this.ListHeight + (footerHeight ? footerHeight : 0)) { // раскрытый дропбокс заходит ниже футера или нижнего края вьюпорта
            return 'top-right';
        } else {
            return 'bottom-right';
        }
    }

    private generateUniqueId() {
        let fnc = (min: number, max: number) => {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
        return Date.now() + fnc(10, 100);
    }

    openDropDownList() {
        if (this.itemsInput == null) {
            this.asyncStart = true;
            this.event.emit('LOAD_TRIGGER');
        } else {
            this.cacheCallback.emit(this.itemsInput);
            this.viewPopover();
        }
    }

    private viewPopover() {
        if (this.popover.isOpen()) {
            this.popover.close();
        } else {
            this.popover.open();
        }
    }

    public showPopover() {
        
    }

    close() {
        this.viewPopover();
    }

    getSelectedRows() {
        return this.listView ? this.listView.getSelectedRows() : [];
    }

    itemClick(data: any) {
        this.itemEvent.emit(data);
    }
}