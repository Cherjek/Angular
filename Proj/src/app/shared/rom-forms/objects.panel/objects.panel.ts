import { AppLocalization } from 'src/app/common/LocaleRes';
﻿import { Component, Input, OnInit, TemplateRef, ViewChild, Output, EventEmitter, AfterViewInit } from '@angular/core';

import { ListView } from '../../../controls/ListView/ListView';
import { NavigateItem } from '../../../common/models/Navigate/NavigateItem';

import { ListItem } from "../../../controls/ListView/ListView";

enum ListViewFieldName { KeyField, DisplayField, AdditionalField }

@Component({
    selector: 'frame-objects-panel',
    templateUrl: 'objects.panel.html',
    styleUrls: ['objects.panel.css']
})

/*
*
    Переделать механизм выбора, таблица не подходит
*/
export class ObjectsPanelComponent implements OnInit, AfterViewInit {
    
    //INPUT
    @Input() NoTabs = false;
    @Input() IsSelected: boolean = false;//режим мультивыбор
    @Input() IsRemoved: boolean = false;//добавляет кнопку убрать, для удаления выбранных
    @Input() OffsetBottom: number;
    @Input() AdditionalField: string;

    //DATA_SOURCE
    private unitsLVSource: any[]; //храним здесь объекты с чекбоксами
    private ldsLVSource: any[]; // храним здесь оборудование с чекбоксами
    private afterViewInit = false;
    private dataSourceChangeOnRemove = false;
    private _dataSource: any[];

    unitsObject: any = {};
    
    @Input()
    get DataSource(): any[] {
        return this._dataSource;
    }
    set DataSource(values: any[]) {

        if (values == null || !values.length) this.unitsObject = {};

        if (values) {
            this._dataSource = (values || []);//(values.filter((x: any) => x["IdLogicDevice"] != null) || []);

            if (!this.dataSourceChangeOnRemove) { // при добавлении новых строк из грида или начальной инициализации всей формы пересчитываем unitsObject
                this._dataSource.forEach((ld: any) => {
                    if (!this.unitsObject[ld.IdUnit]) {
                        this.unitsObject[ld.IdUnit] = {};
                        this.unitsObject[ld.IdUnit].Unit = new ListItem();
                        this.unitsObject[ld.IdUnit].Unit.Data = ld;

                        if (ld.IdLogicDevice != null) {
                            this.unitsObject[ld.IdUnit].LDs = {};
                            this.unitsObject[ld.IdUnit].LDs[ld.IdLogicDevice] = new ListItem();
                            this.unitsObject[ld.IdUnit].LDs[ld.IdLogicDevice].Data = ld;                            
                        }

                    } else if (ld.IdLogicDevice != null && !this.unitsObject[ld.IdUnit].LDs[ld.IdLogicDevice]) {
                        this.unitsObject[ld.IdUnit].LDs[ld.IdLogicDevice] = new ListItem();
                        this.unitsObject[ld.IdUnit].LDs[ld.IdLogicDevice].Data = ld;

                        this.correctUnitCheck(this.unitsObject[ld.IdUnit].LDs[ld.IdLogicDevice]); // если добавлены новые строки из грида а объект уже был почекан                            
                    }
                });
            } else {
                this.dataSourceChangeOnRemove = false; // unitsObject уже пересчитан в removeListItem
            }
        }

        if (this.afterViewInit) {
            this.rerenderLV();
        }
    }
    //DATA_SOURCE_END

    @Input() FooterTemplate: TemplateRef<any>;

    //OUTPUT
    @Output() OnItemClick = new EventEmitter<any>();
    @Output() OnRemoveListItem = new EventEmitter<any>();

    //PRIVATE
    public menuTabHeader: NavigateItem[] = [];
    private menuTabSelect: NavigateItem;

    public ListViewFieldName = ListViewFieldName;

    @ViewChild('listView', { static: false }) listView: ListView;

    ngOnInit(): void {
        this.menuTabHeader.push(Object.assign(new NavigateItem(), { name: AppLocalization.Label32, code: 'logicDevice' }));
        this.menuTabHeader.push(Object.assign(new NavigateItem(), { name: AppLocalization.Objects, code: 'units' }));
        this.menuTabSelect = this.menuTabHeader[0];
    }

    ngAfterViewInit() {
        this.afterViewInit = true;
        setTimeout(() => this.rerenderLV());
    }

    public getFieldName(itemKey: ListViewFieldName) {
        switch (itemKey) {
            case ListViewFieldName.KeyField:
                return (this.menuTabSelect.code === 'logicDevice') ? 'IdLogicDevice' : 'IdUnit';
            case ListViewFieldName.DisplayField:
                return (this.menuTabSelect.code === 'logicDevice') ? 'LogicDeviceDisplayText' : 'UnitDisplayText';
            case ListViewFieldName.AdditionalField:
                {
                    if (this.AdditionalField) {
                        return this.AdditionalField;
                    } else {
                        return (this.menuTabSelect.code === 'logicDevice') ? 'UnitDisplayText' : null;
                    }
                }
        }
    }

    private rerenderLV() {
        this.listView.DataSource = [];

        if (this.menuTabSelect == null || this.menuTabSelect.code === 'logicDevice') { // вкладка Оборудование
            Object.keys(this.unitsObject).forEach(IdUnit => {
                if (this.unitsObject[IdUnit].LDs != null) {
                    Object.keys(this.unitsObject[IdUnit].LDs).forEach(IdLD => {
                        const ds = this.listView.DataSource;
                        ds.push(this.unitsObject[IdUnit].LDs[IdLD]);
                    });
                }
            });
        } else { // вкладка Объекты
            Object.keys(this.unitsObject).forEach(IdUnit => {
                this.listView.DataSource.push(this.unitsObject[IdUnit].Unit);
            });
        }
    }

    public navClick(navItem: NavigateItem) {
        //ререндерим объекты или оборудование в зависимости от кликнутой вкладки
        this.menuTabSelect = navItem;
        this.rerenderLV();
    }

    private correctUnitCheck(item: any) {
        let unitLDsLength: number = Object.keys(this.unitsObject[item.Data.IdUnit].LDs).length;

        let unitCheckLDsLength: number =
            Object.keys(this.unitsObject[item.Data.IdUnit].LDs)
                .filter(IdLD => this.unitsObject[item.Data.IdUnit].LDs[IdLD].IsCheck).length;

        if (unitCheckLDsLength > 0 && unitLDsLength == unitCheckLDsLength) {
            this.unitsObject[item.Data.IdUnit].Unit.IsCheck = true;
            this.unitsObject[item.Data.IdUnit].Unit.IsIndeterminate = false;
        } else if (unitCheckLDsLength > 0 && unitCheckLDsLength < unitLDsLength) {
            this.unitsObject[item.Data.IdUnit].Unit.IsCheck = false;
            this.unitsObject[item.Data.IdUnit].Unit.IsIndeterminate = true;
        } else {
            this.unitsObject[item.Data.IdUnit].Unit.IsCheck = false;
            this.unitsObject[item.Data.IdUnit].Unit.IsIndeterminate = false;
        }
    }

    private correctLDsChecks(item: any) {

        if (!this.unitsObject[item.Data.IdUnit].LDs) return;

        if (item.IsCheck && !item.IsIndeterminate) {
            Object.keys(this.unitsObject[item.Data.IdUnit].LDs).forEach(IdLD => {
                this.unitsObject[item.Data.IdUnit].LDs[IdLD].IsCheck = true;
                this.unitsObject[item.Data.IdUnit].LDs[IdLD].IsIndeterminate = false;
            });

        } else if (!item.IsCheck && !item.IsIndeterminate) {
            Object.keys(this.unitsObject[item.Data.IdUnit].LDs).forEach(IdLD => {
                this.unitsObject[item.Data.IdUnit].LDs[IdLD].IsCheck = false;
                this.unitsObject[item.Data.IdUnit].LDs[IdLD].IsIndeterminate = false;
            });

        } else {
            this.unitsObject[item.Data.IdUnit].Unit.IsCheck = false;
            this.unitsObject[item.Data.IdUnit].Unit.IsIndeterminate = false;

            Object.keys(this.unitsObject[item.Data.IdUnit].LDs).forEach(IdLD => {
                this.unitsObject[item.Data.IdUnit].LDs[IdLD].IsCheck = false;
                this.unitsObject[item.Data.IdUnit].LDs[IdLD].IsIndeterminate = false;
            });
        }
    }

    public itemClick(item: any) {
        if (item == null) { // чекнули хеадер в listView
            let headerCheck: boolean = this.listView.DataSource[0].IsCheck;

            let items = this.listView.getVisibleItems() || [];

            if (this.menuTabSelect == null || this.menuTabSelect.code === 'logicDevice') { // вкладка Оборудование
                items.forEach(ldLI => {
                    this.unitsObject[ldLI.Data.IdUnit].Unit.IsCheck = headerCheck;
                    this.unitsObject[ldLI.Data.IdUnit].Unit.IsIndeterminate = false;
                });
            }
            else { // вкладка Объекты
                items.forEach(unitLI => {
                    Object.keys(this.unitsObject[unitLI.Data.IdUnit].LDs).forEach(IdLD => {
                        this.unitsObject[unitLI.Data.IdUnit].LDs[IdLD].IsCheck = headerCheck;
                        this.unitsObject[unitLI.Data.IdUnit].LDs[IdLD].IsIndeterminate = false;
                    });
                });

            }
        }
        else {
            if (item instanceof Array) {
                item.forEach((_item: any) => {
                    if (this.menuTabSelect == null || this.menuTabSelect.code === 'logicDevice') {
                        this.unitsObject[_item.Data.IdUnit].LDs[_item.Data.IdLogicDevice] = _item;
                        this.correctUnitCheck(_item);
                    } else {
                        this.unitsObject[_item.Data.IdUnit].Unit = _item;
                        this.correctLDsChecks(_item);

                    }
                });
            }
            else {
                if (this.menuTabSelect == null || this.menuTabSelect.code === 'logicDevice') {
                    this.unitsObject[item.Data.IdUnit].LDs[item.Data.IdLogicDevice] = item;
                    this.correctUnitCheck(item);
                } else {
                    this.unitsObject[item.Data.IdUnit].Unit = item;
                    this.correctLDsChecks(item);

                }
            }
        }

        this.OnItemClick.emit({ sender: this, event: item });
    }

    public removeListItem(removeRows: any[]) {
        //находим оставшееся оборудование и ререндерим его в обеих вкладках
        // let leftItems = this.ldsLVSource.filter((item: any) => !item.IsCheck && !item.IsIndeterminate);
        // this.DataSource = leftItems.map(item => item.Data);
        // this.OnRemoveListItem.emit(leftItems.map(item => item.Data));

        if (this.menuTabSelect == null || this.menuTabSelect.code === 'logicDevice') {
            this.listView.DataSource.filter((item: any) => item.IsCheck).forEach((item: any) => { //deletedItems
                if (this.unitsObject[item.Data.IdUnit].LDs) {
                    delete this.unitsObject[item.Data.IdUnit].LDs[item.Data.IdLogicDevice];
                }
                this.unitsObject[item.Data.IdUnit].Unit.IsCheck = false;
                this.unitsObject[item.Data.IdUnit].Unit.IsIndeterminate = false;

                if (this.unitsObject[item.Data.IdUnit].LDs) {
                    if (Object.keys(this.unitsObject[item.Data.IdUnit].LDs).length == 0) delete this.unitsObject[item.Data.IdUnit];
                }
            });

            // let leftItems: ListItem[] = this.listView.DataSource.filter((item: any) => !item.IsCheck);
            // this.OnRemoveListItem.emit(leftItems.map(item => item.Data));
        } else {
            this.listView.DataSource.filter((item: any) => item.IsCheck || item.IsIndeterminate).forEach((item: any) => { //deletedItems
                if (item.IsCheck) delete this.unitsObject[item.Data.IdUnit];
                else if (item.IsIndeterminate) {
                    this.unitsObject[item.Data.IdUnit].Unit.IsCheck = false;
                    this.unitsObject[item.Data.IdUnit].Unit.IsIndeterminate = false;

                    if (this.unitsObject[item.Data.IdUnit].LDs) {
                        Object.keys(this.unitsObject[item.Data.IdUnit].LDs)
                            .filter(IdLD => this.unitsObject[item.Data.IdUnit].LDs[IdLD].IsCheck)
                            .forEach(IdLD => delete this.unitsObject[item.Data.IdUnit].LDs[IdLD]);
                    }
                }
            });
        }

        // this.DataSource = leftItems.map(item => item.Data);
        let leftItems: ListItem[] = [];
        Object.keys(this.unitsObject).forEach(IdUnit => {
            if (this.unitsObject[IdUnit].LDs) {
                Object.keys(this.unitsObject[IdUnit].LDs).forEach(IdLD => {
                    leftItems.push(this.unitsObject[IdUnit].LDs[IdLD]);
                });
            }
            else {
                leftItems.push(this.unitsObject[IdUnit].Unit);
            }
        });

        this.OnRemoveListItem.emit(leftItems.map(item => item.Data));

        this.dataSourceChangeOnRemove = true;
        this.DataSource = leftItems.map(item => item.Data);
    }

    getSelectedRows(): any[] {
        if (this.listView)
            return this.listView.getSelectedRows();
        else
            return [];
    }
}
