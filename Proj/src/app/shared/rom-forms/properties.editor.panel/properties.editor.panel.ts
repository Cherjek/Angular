import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

import { IntervalValueView } from '../../../services/objecteditors.module/Models/IntervalValueView';
import { EntityViewProperty } from '../../../services/common/Models/EntityViewProperty';
import { OptionPropertyType } from '../../../services/common/Models/OptionPropType';
import { AppLocalization } from 'src/app/common/LocaleRes';

@Component({
    selector: 'properties-editor-panel',
    templateUrl: './properties.editor.panel.html',
    styleUrls: ['./properties.editor.panel.css']
})
export class PropertiesEditorPanelComponent implements OnInit {

    @Input() service: any;
    @Input() isEdit = false;
    private _properties: EntityViewProperty[];
    public _propertiesEdit: EntityViewProperty[];
    public _notRequiredProps: EntityViewProperty[];
    @Input()
    set properties(ps: EntityViewProperty[]) {
        this._properties = ps;
        // clone ps array
        if (ps != null) {
            const result: EntityViewProperty[] = [];
            ps.forEach(p => result.push(Object.assign({}, p)));
            ps = result;
        }
        this._propertiesEdit = (ps || []).filter(p => p.IsRequired || p.Value != null);
        this._notRequiredProps = (ps || []).filter(p => !p.IsRequired && p.Value == null);
    }
    @Output() init = new EventEmitter<PropertiesEditorPanelComponent>();

    ngOnInit(): void {
        this.init.emit(this);
    }

    loadArrayValues(prop: EntityViewProperty) {
        if ((prop as any).arrayValues == null) {

            let parentProperties: EntityViewProperty[] = null;

            if (prop.ParentProperties != null && prop.ParentProperties.length > 0) {
                const parentProperty = this._propertiesEdit.find(x => x.Code === prop.ParentProperties[0]);
                if (parentProperty != null) {

                    // если есть родительское свойство и его значение не задано, получить значения нельзя
                    // поэтому выходим из метода
                    if (parentProperty.Value == null) {
                        let text = AppLocalization._label_1.replace('{0}', parentProperty.Name);
                        throw new Error(text);
                    }

                    parentProperties = [parentProperty];
                }
            }

            const request = {
                parentProps: parentProperties,
                prop
            };

            this.service
                .getUnitPropertyOptionValues(request)
                .subscribe((data: any[]) => {
                    (prop as any).arrayValues = data;
                },
                    (error: any) => {

                    });
        }
    }

    cascadePropertyChange(prop: EntityViewProperty) {
        if (prop.DependProperties != null && prop.DependProperties.length > 0) {
            const dependProperty = this._propertiesEdit.find(x => x.Code === prop.DependProperties[0]);
            if (dependProperty != null) {
                (dependProperty as any).arrayValues = null;
                (dependProperty as any).Value = null;
                (dependProperty as any).error = null;

                this.cascadePropertyChange(dependProperty);
            }
        }
    }

    getPropType(propType: string | number) {
        if (isNaN(Number(propType)) && typeof propType === 'string') {
            const val = OptionPropertyType[propType];
            return val;
        }
        return propType;
    }

    getEditProperties() {

        const cloneProperties = [...this._properties].map((p: any) => ({ ...p }));
        cloneProperties.forEach((prop: EntityViewProperty) => {
            const pEdit = this._propertiesEdit
                .filter((propEdit: EntityViewProperty) => propEdit.Code === prop.Code);

            if (pEdit != null && pEdit.length) {

                (pEdit[0] as any).error = null;

                const value = pEdit[0].Value;

                if (pEdit[0].Value != null) {

                    if (prop.IsRequired) {
                        const regExpression = /[a-zA-Zа-яА-Я0-9\S]+/;
                        if (!regExpression.exec(`${value}`)) {
                            (pEdit[0] as any).error = `${AppLocalization.NotTheCorrectValue} "${value}"`;
                        }
                    }
                }

                prop.Value = value;
            } else {
                prop.Value = null;
            }
        });

        const errorProps = this._propertiesEdit.filter((f: any) => f.error != null);
        if (errorProps.length) {
            throw errorProps.map((f: any) => f.error).join(', ');
        }

        return cloneProperties;
    }

    addProperty(prop: EntityViewProperty) {
        prop.Value = null;
        this._propertiesEdit.push(prop);
        const ind: number = this._notRequiredProps.findIndex(p => p.Code == prop.Code);
        this._notRequiredProps.splice(ind, 1);
    }

    deleteProperty(prop: EntityViewProperty) {
        this._notRequiredProps.push(prop);
        const ind: number = this._propertiesEdit.findIndex(p => p.Code == prop.Code);
        this._propertiesEdit.splice(ind, 1);
    }

    rollbackProperty() {
        this.properties = this._properties;
    }

    eventDropDown(sender: any, prop: EntityViewProperty) {
        if (sender.event === 'LOAD_TRIGGER') {
            try {
                this.loadArrayValues(prop);
            } catch (e) {
                (prop as any).error = e;
                (prop as any).arrayValues = [];
            }
        }
    }

    clearCombobox(cb: any) {
        setTimeout(() => {
            cb.model = null;
        }, 0);
    }

    /*
     * Interval type work
     */
    getIntervalTypes() {
        return [
            {
                Code: 0,
                Text: AppLocalization.Disabled
            },
            {
                Code: 1,
                Text: AppLocalization.Through
            },
            {
                Code: 2,
                Text: AppLocalization.Daily
            },
            {
                Code: 3,
                Text: AppLocalization.Monthly
            }
        ];
    }
    getIntervalType(type: number) {
        return this.getIntervalTypes().filter((t: any) => t.Code === type)[0];
    }
    updateIntervalValue(type: number, prop: any) {
        prop.Value = new IntervalValueView(type);
    }
    /*
     * End interval type work
     */
}
