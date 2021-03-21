import { Component, OnInit, Input, Output, EventEmitter,
    HostListener, OnChanges, SimpleChanges, SimpleChange, ViewChild, TemplateRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CalendarPickerType } from 'src/app/controls/CalendarPicker/calendar-picker-ro5.component';
import { GlobalValues } from '../../../../core';
import { IEntityViewProperty } from '../../../../services/common/Interfaces/IEntityViewProperty';

@Component({
    selector: 'ahm-shared-properties',
    templateUrl: './property.component.html',
    styleUrls: ['./property.component.less']
})
export class SharedPropertyComponent implements OnInit, OnChanges {
    calendarPickerTypes = CalendarPickerType;
    public errors: any[] = [];
    public loadingContentPanel = false;
    public isPropEdit = false;
    public _properties: IEntityViewProperty[];

    private formValidateGroup: FormGroup;

    @Input() errorLoadEntity: any;
    @Input() isNew = false;
    @Input() isBackTwo = false;
    @Input() properties: IEntityViewProperty[];
    @Input() template: TemplateRef<any>;
    @Input() showHeaderPropertyEdit = true;
    @Input() permission: string;

    @Output() optionControlDropDown = new EventEmitter<any>();
    @Output() save = new EventEmitter<any>();
    @Output() cancelEvent = new EventEmitter<any>();
    @Output() propChange = new EventEmitter<any>();

    @ViewChild('dropDown', { static: false }) public dropDown: any;
    indexTypestring: number;

    @HostListener('document:keydown', ['$event']) onKeyDownFilter(event: KeyboardEvent) {
        if (event.ctrlKey) {
            // Ctrl + s = save
            if (event.keyCode === 83) {
                event.preventDefault();
                this.saveEntity();
            }
        } else {
            if (event.keyCode === 27) {
                this.cancel();
            }
        }
    }

    /* клик по форме - нужен для ngbDropdown(dropDown) */
    @HostListener('window:click', ['$event']) public onWindowClick(event: any) {
        if (this.isPropEdit && this.dropDown) {
            this.dropDown.close();
        }
    }

    constructor() { }

    ngOnInit() {
        if (this.isNew) {
            this.changeProperties();
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.properties && (<SimpleChange>changes.properties).currentValue) {
            this.loadPropertiesFromState();
        }
    }

    private loadPropertiesFromState() {
        this._properties = JSON.parse(JSON.stringify(this.properties));
        this.indexTypestring = this._properties.findIndex(x => x.Type === 'String');
    }

    public changeProperties() {
        this.isPropEdit = true;
    }

    private cancelChangeProperty() {
        this.isPropEdit = false;
        this.cancelEvent.emit();
    }

    private rollBackProperty() {
        this.loadPropertiesFromState();
        // this.createFormGroup();
    }

    public cancel() {
        if (this.isNew) {
            // redirect to back page
            this.back2Objects();
        } else {
            this.rollBackProperty();
            this.cancelChangeProperty();
        }
    }

    public saveEntity() {
        this.save.emit(this._properties);
    }

    public back2Objects() {
        if (this.isNew && this.isBackTwo) {
            GlobalValues.Instance.Page.backwardButton.popLastUrl();
        }
        GlobalValues.Instance.Page.backwardButton.navigate();
    }

    /* 
    * Controls method
    */
    public eventDropDown(sender: any, prop: IEntityViewProperty) {
         if (sender.event === 'LOAD_TRIGGER' || sender.event === 'SELECT') {
             this.optionControlDropDown.emit({ control: sender, property: prop, properties: this._properties });
         }
    }
    /* 
    * Controls method end
    */

    public dropDownOpen() {
        try {
            this.dropDown.open();
        }
        catch(e) {}
    }

    public onPropChange(element: any, event: any) {
        this.propChange.emit({element, event})
    }
}