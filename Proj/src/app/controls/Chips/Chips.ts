import { Component, Input, Output, HostListener, ViewChild, OnInit, AfterViewInit, EventEmitter } from '@angular/core';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, merge, map, filter } from 'rxjs/operators';

declare var $: any;

const states = ['Alabama', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California', 'Colorado',
    'Connecticut', 'Delaware', 'District Of Columbia', 'Federated States Of Micronesia', 'Florida', 'Georgia',
    'Guam', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine',
    'Marshall Islands', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana',
    'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
    'Northern Mariana Islands', 'Ohio', 'Oklahoma', 'Oregon', 'Palau', 'Pennsylvania', 'Puerto Rico', 'Rhode Island',
    'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virgin Islands', 'Virginia',
    'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];

@Component({
    selector: 'chips-ro5',
    templateUrl: 'Chips.html',
    styleUrls: ['Chips.css']
})

export class Chips implements OnInit, AfterViewInit {

    chips: any[] = [];
    // если true, позволяет при нажатии Enter добавлять элементы в chips
    @Input() itemEnterPush = false;
    // pattern для маски ввода, например проверка, что в model email
    @Input() validPatternItemEnterPush: string;
    @Input() itemsInput: any[] = [];
    @Input() singleCheck: boolean = false;
    @Output() event = new EventEmitter<any>();
    @Input() initialItems: any[] = [];

    public model: any;
    selectIndexCursor: number = 0; // индекс последнего чекнутого чипса
    selectIndex: any = { 0: true }; // индексы всех чекнутых чипсов
    public controlId: string;


    @ViewChild('instance', { static: true }) instance: NgbTypeahead;
    focus$ = new Subject<string>();
    click$ = new Subject<string>();

    ngOnInit() {
        if(this.initialItems && this.initialItems.length) {
            this.chips = this.initialItems;
        }
        this.controlId = "chips_" + this.generateUniqueId();
    }

    ngAfterViewInit() {
        $("#" + this.controlId).focus();
    }

    @Output() removeAllChips = new EventEmitter<boolean>();

    @HostListener('keydown', ['$event'])
    public handleKeyboardEvent(event: KeyboardEvent): void {
        if (event.keyCode == 8/*Backspace*/ || event.keyCode == 46/*Delete*/) { // удаляем чекнутые чипсы
            //backspace   
            //delete
            this.removeSelectItems();
            this.updateCursorPosition();
        }
        else if ( (event.keyCode == 35/*End*/ || event.keyCode == 36/*Home*/) && !this.singleCheck ) { // чекаем чипсы от начала до первого чекнутого или от последнего чекнутого до конца
            //End, Home button
            let start = 0;
            let end = this.chips.length - 1;

            this.selectIndex = {};
            if (event.shiftKey) {/*Shift*/

                if (event.keyCode == 35/*End*/) start = this.selectIndexCursor;
                else end = this.selectIndexCursor;                
            }
            else {
                if (event.keyCode == 35/*End*/) start = this.selectIndexCursor = end;
                else end = this.selectIndexCursor = start;
            }
            for (let i = start; i <= end; i++) {
                this.selectIndex[i] = true;
            }
        }

        if (event.keyCode == 37/*<-*/ || event.keyCode == 39/*->*/) { // чекаем чипсы слева или справа по одной штуке

            if (event.keyCode == 37/*<-*/) {
                //left arrow
                if (this.selectIndexCursor === 0) {
                    this.selectIndexCursor = this.chips.length - 1;
                }
                else
                    this.selectIndexCursor--;
            }
            else if (event.keyCode == 39/*->*/) {
                //rigt arrow
                if (this.selectIndexCursor === this.chips.length - 1) {
                    this.selectIndexCursor = 0;
                }
                else
                    this.selectIndexCursor++;
            }

            if (event.shiftKey && !this.singleCheck) { // чекаем чипсы слева или справа все
                let keys = this.getSelectedItems();
                if (keys.length > 1) {
                    if (event.keyCode == 37/*<-*/) {
                        let end = keys[keys.length - 1];
                        if (Math.abs(this.selectIndexCursor - end) === 1) {
                            delete this.selectIndex[end];
                        }
                    }
                    else {
                        let start = keys[0];
                        if (Math.abs(this.selectIndexCursor - start) === 1) {
                            delete this.selectIndex[start];
                        }
                    }
                }
            }
            else {
                this.selectIndex = {};
            }
            this.selectIndex[this.selectIndexCursor] = true;
        } 
        
        event.stopPropagation();
    }

    public focus() {
        this.event.emit({ chips: this, event: 'LOAD_TRIGGER' });
    }

    public inputKeydown(event: any) {

        //доходим курсором до самой крайней позиции, после переходим на чипсы и устанавливаем курсор на последнем элементе
        if (event.keyCode == 37/*<-*/ || event.keyCode == 8/*Backspace*/) {
            if (event.target.selectionStart === event.target.selectionEnd) {//не выделен текст, курсор в одной позиции 
                if (event.target.selectionStart === 0) {
                    this.instance.dismissPopup();
                    $("#" + this.controlId).focus();    
                    let length = (this.chips || []).length;
                    if (length >= 0) {
                        let index = length - 1;
                        this.selectIndex = {};
                        this.selectIndex[index] = true;
                        this.selectIndexCursor = index;
                    }
                }
            }
        } else if (event.keyCode == 13) {
            if (this.itemEnterPush) {
                if (this.validPatternItemEnterPush) {
                    const regexp = new RegExp(this.validPatternItemEnterPush);
                    const val = regexp.exec(this.model);
                    if (val == null) return;
                }

                if (((this.chips || []).find(x => x === this.model) == null)) {
                    this.chips.push(this.model);
                }
            }
        }

        event.stopPropagation();
    }

    //MOUSE INPUT
    public chipsItemClick(index: number, event: any) {
        if (event.ctrlKey && !this.singleCheck) { // чекаем / анчекаем чипс
            this.selectIndex[index] = !this.selectIndex[index];
        }
        else if (event.shiftKey && !this.singleCheck) { // чекаем все чипсы до ближайшего чекнутого
            let start = 0;
            let end = 0;
            
            let keys = this.getSelectedItems();
            if (keys.length > 0) {
                start = keys[0];
                end = keys[keys.length - 1];
                if (index < start) start = index;
                else if (index > end) end = index;
            }
            else {
                if (this.selectIndexCursor < index) {
                    start = this.selectIndexCursor;
                    end = index;
                }
                else {
                    start = index;
                    end = this.selectIndexCursor;
                }
            }


            for (let i = start; i <= end; i++) {
                this.selectIndex[i] = true;
            }
        }
        else { // простой клик по чипсу
            this.selectIndex = {};
            this.selectIndex[index] = true;
        }
        this.selectIndexCursor = index;
    }

    private generateUniqueId() {
        let fnc = (min: number, max: number) => {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
        return Date.now() + fnc(10, 100);
    }

    private updateCursorPosition() {
        let start = 0;
        let end = this.chips.length - 1;

        if (this.selectIndexCursor > end) this.selectIndexCursor = end;
        else if (this.selectIndexCursor < start) this.selectIndexCursor = start;
        this.selectIndex[this.selectIndexCursor] = true;
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
                map((term: any) => {
                        const result = term === '' ? this.filterDropDownItems(term)
                                : this.filterDropDownItems(term).filter((v: string) => v.toLowerCase().indexOf(term.toLowerCase()) > -1);
                        return result;
                    }
                )
            );
            
            
    private filterDropDownItems(term: string) {
        //return (term === '' ? states : states.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10);
        return !this.chips ? this.itemsInput : this.itemsInput.filter(v => this.chips.find((chip: string) => chip.toLowerCase().indexOf(v.toLowerCase()) > -1) == null);
    }

    private getSelectedItems(): Array<number> {
        return Object.keys(this.selectIndex).map(val => parseInt(val)).sort((n1, n2) => { return n1 - n2; });
    }

    public selectItem(event: any, instance: any) {
        this.chips.push(event.item);
        // this.model = null;
        setTimeout(() => {
            instance._elementRef.nativeElement.value = null;
            setTimeout(() => instance._elementRef.nativeElement.focus(), 0);
        }, 0);
        
    }    

    private removeSelectItems() {
        for (let i = this.chips.length; i >= 0; i--) {
            if (this.selectIndex[i]) {
                delete this.selectIndex[i];
                this.chips.splice(i, 1);
            }
        }
    }    

    public chipsItemRemove(index: number, event: any) {
        if (this.singleCheck) {
            delete this.selectIndex[this.selectIndexCursor];
            if ((index == this.selectIndexCursor && this.selectIndexCursor > 0) || index < this.selectIndexCursor) {
                this.selectIndexCursor--;
            }
            this.selectIndex[this.selectIndexCursor] = true;
        } else if (!this.singleCheck) {
            // надо более подробно обсудить
        }

        this.chips.splice(index, 1);

        event.stopPropagation();
    }

    public allChipsRemove() {
        this.chips = [];
        this.selectIndexCursor = 0;
        this.selectIndex = { 0: true };
        this.removeAllChips.emit(true);
    }
}