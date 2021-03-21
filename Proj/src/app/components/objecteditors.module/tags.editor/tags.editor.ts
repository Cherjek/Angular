import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, ViewChild, Input, TemplateRef, ElementRef, Output, EventEmitter } from '@angular/core';
import { DataGrid, DataGridColumn } from "../../../controls/DataGrid";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs/index";

import { GlobalValues } from '../../../core';

import * as Const from "../../../common/Constants";
import Constants = Const.Common.Constants;

import { TagsEditorService } from "../../../services/objecteditors.module/tags.editor/TagsEditor.service";
import { TagView, LogicTagTypeView, DeviceInfoView, TagScriptView, IObject, TagTypeView, DeviceTagTypeView, TagScriptVariableView, TagThresholdView } from "../../../services/objecteditors.module/Models/tags.editor/_tagsEditorModels";
import { TagValueService } from 'src/app/services/references/tag-value.service';
import { TagValueFilter } from 'src/app/services/objecteditors.module/Models/tags.editor/TagValueFilter';
import { TagValueBoundsService } from 'src/app/services/commands/Configuration/tag-value-bounds.service';
import { SubSystem } from 'src/app/services/references/models/SubSystem';
import { HierarchyMapRomService } from 'src/app/services/additionally-hierarchies/hierarchy-map-rom.service';

const __keyTagType = "TagType";
const __keyDevice_Script = "Device_Script";
const __keyDeviceTagType_ScriptVariable = "DeviceTagType_ScriptVariable";
const __keyThreshold = "Threshold";
const _keyValueFilter = 'TagValueFilter';
const __keySubSystem = 'SubSystem'

enum TagsEditorMode { Create, Edit }

@Component({
    selector: 'tags-editor',
    templateUrl: './tags.editor.html',
    styleUrls: ['./tags.editor.css'],
    providers: [TagsEditorService]
})
export class TagsEditorComponent implements OnInit {

    constructor(
        public tagValueBoundsService: TagValueBoundsService,
        public activatedRoute: ActivatedRoute,
        public tagFilterValueSerivce: TagValueService,
        public subSystemsService: HierarchyMapRomService,
        public tagsEditorService: TagsEditorService) {

        this.subscription = this.activatedRoute.queryParams.subscribe((params: any) => {
            
        });
    }

    @Input() parentContainer: ElementRef<any>;
    @Input() IdLogicDevice: number;
    @Input() defTagView: TagView;// если задано, используется короткая версия
    @Input() isRowTemplateEdit: boolean;
    @Output() changeTagColumn = new EventEmitter<any>();
    @Output() init = new EventEmitter<any>();
    @ViewChild('Ro5DataGrid', { static: true }) dataGrid: DataGrid;
    @ViewChild('cellParameter', { static: true }) cellParameter: TemplateRef<any>;
    @ViewChild('cellCombobox', { static: true }) cellCombobox: TemplateRef<any>;
    @ViewChild('cellDelete', { static: true }) cellDelete: TemplateRef<any>;
    @ViewChild('headerTemplate', { static: true }) headerTemplate: TemplateRef<any>;
    @ViewChild('rowTemplate', { static: true }) rowTemplate: TemplateRef<any>;    

    private logicTagTypes: LogicTagTypeView[];
    public logicTagTypesDyn: LogicTagTypeView[];// урезанный вариант logicTagTypes, согласно записям в таблице
    public isEditMode: boolean;

    subscription: Subscription;
    loadingContentPanel = true;
    errorsContentForm: any[] = [];

    ngOnInit() {
        this.init.emit(this);
        this.initDataGrid();
        this.cachedServiceRequest();        
    }

    private cachedServiceRequest() {
        this.tagsEditorService.getTagTypes().subscribe();
    }

    private initDataGrid() {
        if (this.isRowTemplateEdit) {
          this.dataGrid.HeaderTemplate = this.headerTemplate;
          this.dataGrid.HeaderTextTemplate = AppLocalization.Label75;
          this.dataGrid.RowsTemplate = this.rowTemplate;
        }
        this.dataGrid.initDataGrid();

        let columns: any[] = [
            {
                Name: "LogicTagType",
                Caption: AppLocalization.Label51,
                CellTemplate: this.cellParameter
            }
        ];

        if (this.defTagView == null) {
            columns = columns.concat([
                {
                    Name: __keyTagType,
                    Caption: AppLocalization.Type,
                    CellTemplate: this.cellCombobox
                },
                {
                    Name: __keyDevice_Script,
                    Caption: AppLocalization.Source,
                    CellTemplate: this.cellCombobox
                }
            ]);
        }

        columns = columns.concat([
            {
                Name: __keyDeviceTagType_ScriptVariable,
                Caption: AppLocalization.MeasuringChannel,
                CellTemplate: this.cellCombobox
            },
            {
                Name: __keyThreshold,
                Caption: AppLocalization.Limitations,
                CellTemplate: this.cellCombobox
            },
            {
                Name: _keyValueFilter,
                Caption: AppLocalization.Filter,
                CellTemplate: this.cellCombobox
            },
            {
                Name: __keySubSystem,
                Caption: AppLocalization.Subsystem,
                CellTemplate: this.cellCombobox,
                Width: 200
            },
            
        ]);
        if (!this.isRowTemplateEdit) {
          columns.push({
            Name: "DeleteAction",
            CellTemplate: this.cellDelete,
            Width: 100
          });
        }

        this.dataGrid.Columns = columns;
    }

    @Input()
    set initGridDataSource(ds: TagView[]) {
        if (ds != null) {
            this.isEditMode = true;

            let map = (tagView: TagView) => {

                let newTagView = new TagViewEx();

                newTagView.Id = tagView.Id;
                newTagView.LogicTagType = tagView.LogicTagType;

                newTagView.ValueField.TagType.__value = tagView.TagType;

                if (tagView.TagType.Id === 0) {
                    newTagView.ValueField.Device_Script.__value = tagView.Device;
                    newTagView.ValueField.DeviceTagType_ScriptVariable.__value = tagView.DeviceTagType;
                } else {
                    newTagView.ValueField.Device_Script.__value = tagView.Script;
                    newTagView.ValueField.DeviceTagType_ScriptVariable.__value = tagView.ScriptVariable;
                }

                newTagView.ValueField.Threshold.__value = tagView.Threshold;
                newTagView.ValueField.TagValueFilter.__value = tagView.TagValueFilter;
                newTagView.ValueField.SubSystem.__value = tagView.SubSystem;

                return newTagView; //нужен для работы по каждому полю с значениями
            }
            this.dataGrid.DataSource = ds.map((tv: TagView) => map(tv));
        }
    }

    public onViewLogicTagType(event: string) {
        if (event === 'LOAD_TRIGGER') {
            this.tagsEditorService
                .getLogicTagTypes(this.IdLogicDevice)
                .subscribe((data: LogicTagTypeView[]) => {
                        this.logicTagTypesDyn =
                            this.logicTagTypes = data;
                    },
                    (error: any) => {

                    });
        }
    }

    //доступно только при режиме добавления тегов - TagsEditorMode.Create
    public addTags(tags: LogicTagTypeView[]) {
        if (!this.dataGrid.DataSource) this.dataGrid.DataSource = [];

        let max = this.dataGrid.DataSource.length ? Math.max(...this.dataGrid.DataSource.map((t: TagViewEx) => t.Id)) : 1;

        let map = (ltView: LogicTagTypeView) => {

            let tagView = new TagView(ltView);
            tagView.Id = ++max;//нужен уникальный ключ для удаления строк
            let tag = Object.assign(new TagViewEx(), tagView);//нужен для работы по каждому полю с значениями
            if (this.defTagView != null) {
                tag.ValueField.TagType.__value = this.defTagView.TagType;
                tag.ValueField.Device_Script.__value = this.defTagView.Device;
            } else {
                if (this.tagsEditorService.cachedTagTypes != null && this.tagsEditorService.cachedTagTypes.length) {
                    tag.ValueField.TagType.__value = this.tagsEditorService.cachedTagTypes[0];
                }
            }
            return tag;
        }

        this.dataGrid.DataSource = this.dataGrid.DataSource.concat(tags.map((ltView: LogicTagTypeView, index: number) => map(ltView)));
    }

    public updateLogicTagTypes() {
        let result = this.logicTagTypes;

        let sources = (this.dataGrid.DataSource || []);

        if (result) {
            this.logicTagTypesDyn = result.filter((lt: LogicTagTypeView) => {
                return sources.find((ltr: TagViewEx) => { return ltr.LogicTagType.Id == lt.Id }) == null;
            });
        } else {
            this.logicTagTypesDyn = result;
        }
    }


    /*
     * COMBOBOX CELL WORK
     */

    public eventCellComboboxDropDown(sender: any, item: TagViewEx, column: DataGridColumn, comboBox: any) {
        if (sender.event === 'LOAD_TRIGGER') {
            
            let field: __valueField = item.ValueField[column.Name];

            try {
                let observ: any;
                let getParentFieldValue = (keyField: string) => {
                    let parentVal = <__valueField>item.ValueField[keyField];
                    if (parentVal.__value == null) {

                        let parentColumn = this.dataGrid.Columns.find((c: DataGridColumn) => c.Name === keyField);
                        throw `${AppLocalization.NotSelectedFieldValue} ${parentColumn.Caption}`;
                    }
                    return parentVal.__value;
                }

                if (column.Name === __keyTagType) {

                    observ = this.tagsEditorService.getTagTypes();

                }
                else if (column.Name === __keyDevice_Script) {

                    let value = <IObject>getParentFieldValue(__keyTagType);
                    if (value.Id === 0)
                        observ = this.tagsEditorService.getDevices(this.IdLogicDevice);
                    else 
                        observ = this.tagsEditorService.getScripts();
                }
                else if (column.Name === __keyDeviceTagType_ScriptVariable) {
                    
                    let value = <IObject>getParentFieldValue(__keyTagType);
                    if (value.Id === 0) {
                        let devInfo = <DeviceInfoView>getParentFieldValue(__keyDevice_Script);
                        observ = this.tagsEditorService.getDeviceTagTypes(devInfo.IdDeviceType);
                    } else {
                        let scriptInfo = <TagScriptView>getParentFieldValue(__keyDevice_Script);
                        observ = this.tagsEditorService.getScriptOutVariables(scriptInfo.OutVariables);
                    }

                }
                else if (column.Name === __keyThreshold) {
                    
                    // observ = this.tagsEditorService.getTagThresholds(this.IdLogicDevice, (<TagView>item).LogicTagType.Id);
                    observ = this.tagValueBoundsService.getBounds((<TagView>item).LogicTagType.IdLogicTagType || 0);
                }

                else if (column.Name === _keyValueFilter) {
                    observ = this.tagFilterValueSerivce.getTagValueFilter(item.LogicTagType.IdLogicTagType || 0);
                }

                else if(column.Name === __keySubSystem) {
                    observ = this.subSystemsService.getSubSystems()
                }

                if (observ) {
                    observ
                        .subscribe((data: IObject[]) => {
                                data.forEach((d: IObject) => {
                                    if (d.Name == null || !d.Name.length) {
                                        d.Name = Constants.NO_NAME;
                                    }
                                });
                                field.__arrayValues = data || [];
                            },
                            (error: any) => {
                                throw error;
                            });
                } else {
                    throw AppLocalization.NoSourceForField;
                }
            } catch (e) {
                this.errorsContentForm = [e];
                sender.comboBox.asyncStart = false;
            }
        }
    }

    public cascadeCellComboboxChange(item: any, column: DataGridColumn) {
        let fields: string[] = [];
        if (column.Name === __keyTagType) {
            fields = [__keyDevice_Script, __keyDeviceTagType_ScriptVariable/*, __keyThreshold*/];
            this.changeTagColumn.emit({ col: __keyTagType, val: item.ValueField[__keyTagType].__value });
        }
        else if (column.Name === __keyDevice_Script) {
            fields = [__keyDeviceTagType_ScriptVariable/*, __keyThreshold*/];
            this.changeTagColumn.emit({ col: __keyDevice_Script, val: item.ValueField[__keyDevice_Script].__value });
        }
        //else if (column.Name === __keyDeviceTagType_ScriptVariable) {
        //    fields = [__keyThreshold];
        //}

        fields.forEach((f: string) => item.ValueField[f] = new __valueField());
    }

    /*
     * COMBOBOX CELL WORK END
     */

    getTagViewItems() {
        return (this.dataGrid.DataSource || []).map((tagViewEdit: TagViewEx) => {
            let tagView = new TagView();
            tagView.Id = this.isEditMode ? tagViewEdit.Id : null;
            tagView.LogicDevice = { Id: this.IdLogicDevice };
            tagView.LogicTagType = Object.assign(new LogicTagTypeView(), tagViewEdit.LogicTagType);
            tagView.TagType = Object.assign(new TagTypeView(0, ""), tagViewEdit.ValueField.TagType.__value);
            tagView.SubSystem = Object.assign(new SubSystem(), tagViewEdit.ValueField.SubSystem.__value)
            if (tagViewEdit.ValueField.TagValueFilter.__value) {
              tagView.TagValueFilter = Object.assign(new TagValueFilter(), tagViewEdit.ValueField.TagValueFilter.__value);
            }

            let val1 = tagViewEdit.ValueField.Device_Script.__value;
            let val2 = tagViewEdit.ValueField.DeviceTagType_ScriptVariable.__value;
            if (tagView.TagType.Id === 0) {
                tagView.Device = val1 != null ? Object.assign(new DeviceInfoView(0, ""), val1) : val1;
                tagView.DeviceTagType = val2 != null ? Object.assign(new DeviceTagTypeView(0, ""), val2) : val2;
            } else {
                tagView.Script = val1 != null ? Object.assign(new TagScriptView(0, ""), val1) : val1;
                tagView.ScriptVariable = val2 != null ? Object.assign(new TagScriptVariableView(0, ""), val2) : val2;
            }
            if (tagViewEdit.ValueField.Threshold.__value != null)
                tagView.Threshold = Object.assign(new TagThresholdView(0, ""), tagViewEdit.ValueField.Threshold.__value);

            return tagView;

        });
    }
}

class TagViewEx extends TagView {
    ValueField: TagViewValue;

    constructor() {
        super();
        this.ValueField = new TagViewValue();
    }
}

class TagViewValue {
    TagType: __valueField;
    Device_Script: __valueField;
    DeviceTagType_ScriptVariable: __valueField;
    Threshold: __valueField;
    TagValueFilter: __valueField;
    SubSystem: __valueField;

    constructor() {
        this.TagType = new __valueField();
        this.Device_Script = new __valueField();
        this.DeviceTagType_ScriptVariable = new __valueField();
        this.Threshold = new __valueField();
        this.TagValueFilter = new __valueField();
        this.SubSystem = new __valueField();
    }
}

class __valueField {
    __arrayValues: IObject[];
    __value: IObject;
}
