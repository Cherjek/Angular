import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';

declare var $: any;

@Component({
    selector: 'check-box-ro5',
    templateUrl: 'CheckBox.html',
    styleUrls: ['CheckBox.css']
})

export class CheckBox implements OnChanges {
    @Input() disabled: boolean;
    @Input() checked: boolean;
    @Input() label: string;
    @Input() indeterminate: any;
    @Input() name: string;

    public TypeInput = TypeInput;
    public TypeInputControl: TypeInput = TypeInput.Checkbox;
    private _typeInput: string;
    @Input()
    get typeInput(): string {
        return this._typeInput;
    }
    set typeInput(v: string) {
        if (v === 'checkbox') this.TypeInputControl = TypeInput.Checkbox;
        else this.TypeInputControl = TypeInput.Radio;
        this._typeInput = v;
    }

    @Output() onClick = new EventEmitter<any>();

    ngOnChanges(sc: SimpleChanges) {
        if (sc.disabled != null) {
            if ((<SimpleChange>sc.disabled).currentValue === true) {
                //дизейбл элемента
            }
        }
    }

    public labelClick(event: any) {
        if (!this.disabled) {
            if (!this.checked && this.indeterminate) {
                this.checked = this.indeterminate = false;
            }
            else {
                if (this.TypeInputControl === TypeInput.Radio)
                    this.checked = true;
                else
                    this.checked = !this.checked;
            }
            this.onClick.emit({ checked: this.checked });
        }
    }
}

enum TypeInput { Checkbox, Radio }