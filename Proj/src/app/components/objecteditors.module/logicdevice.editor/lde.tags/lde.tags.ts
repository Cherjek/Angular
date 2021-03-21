import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { LogicDeviceEditorTagsService } from "../../../../services/objecteditors.module/logicDevice.editor/lde.tags/LogicDeviceEditorTags";

import * as GridControls from '../../../../controls/DataGrid';
import DGSelectionRowMode = GridControls.SelectionRowMode;
import DGActionButton = GridControls.ActionButtons;
import DGActionButtonConfirmSettings = GridControls.ActionButtonConfirmSettings;

import { DataGrid } from "../../../../controls/DataGrid";
import { Subscription } from "rxjs/index";
import { Router, ActivatedRoute } from "@angular/router";

import { ExportXlsxOptions, ExportColInfo } from "../../../../controls/Services/ExportToXlsx";

import { LDETagsFilterContainerService } from "../../../../services/objecteditors.module/logicDevice.editor/lde.tags/Filters/LDETagsFilterContainer.service";
import { FilterRowPipe } from "../../../../shared/rom-pipes/filter-row.pipe";
import { FiltersCustomPanelComponent } from "../../../../shared/rom-forms/filters.custompanel";
import { TagsEditorService } from "../../../../services/objecteditors.module/tags.editor/TagsEditor.service";

import { PermissionCheck } from "../../../../core";

@Component({
    selector: 'lde-tags',
    templateUrl: './lde.tags.html',
    styleUrls: ['./lde.tags.css'],
    providers: [TagsEditorService]
})
export class LDETagsComponent implements OnInit, OnDestroy {
    DGErrors: any[] = [];
    loadingContentPanel: boolean;

    @ViewChild('Ro5DataGrid', { static: true }) dataGrid: DataGrid;
    @ViewChild('LogicTagTypeColumnTemplate', { static: true }) logicTagTypeColumnTemplate: TemplateRef<any>;
    @ViewChild('TagTypeColumnTemplate', { static: true }) tagTypeColumnTemplate: TemplateRef<any>;
    @ViewChild('SourceColumnTemplate', { static: true }) sourceColumnTemplate: TemplateRef<any>;
    @ViewChild('MeasureChannelColumnTemplate', { static: true }) measureChannelColumnTemplate: TemplateRef<any>;
    @ViewChild('ThresholdColumnTemplate', { static: true }) thresholdColumnTemplate: TemplateRef<any>;
    @ViewChild('FilterTagTypeColumnTemplate', { static: true }) filterTagTypeColumnTemplate: TemplateRef<any>;
    @ViewChild('SubSystemColumnTemplate', { static: true }) subSystemColumnTemplate: TemplateRef<any>;

    subscription: Subscription;
    ldId: number;

    Filter: FilterRowPipe = new FilterRowPipe();
    BigDataSource: any[];
    showFilter: boolean = false;
    ldeTags$: Subscription;
    checkAuthorization$: Subscription;

    constructor(public ldeTagsService: LogicDeviceEditorTagsService,
                public tagsEditorService: TagsEditorService,
                public router: Router,
                public activatedRoute: ActivatedRoute,
                public filtersContainerService: LDETagsFilterContainerService,
                public permissionCheck: PermissionCheck) {
        this.subscription = this.activatedRoute.parent.params.subscribe(params => {
            this.ldId = params['id'];
        });
    }

    ngOnInit() {
        this.loadingContentPanel = true;
        this.renderTagsFromBackEnd();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.unsubscriber([this.subscription, this.ldeTags$, this.checkAuthorization$]);
    }

    unsubscriber(subs: Subscription[]) {
        subs.forEach(sub => {
            if (sub) { sub.unsubscribe(); }
        });
    }

    renderTagsFromBackEnd() {
        this.loadingContentPanel = true;
        this.ldeTags$ = this.ldeTagsService.getTags(this.ldId ).subscribe(
            (tags: any) => {
                this.initDG(tags);
                this.initFilter(this.BigDataSource);
                this.loadingContentPanel = false;
            },
            (error: any) => {
                this.loadingContentPanel = false;
                this.DGErrors.push(error);
            }
        );
    }

    initDG(tags: any[]) {
        this.dataGrid.initDataGrid();
        this.dataGrid.KeyField = 'Id';
        this.dataGrid.SelectionRowMode = DGSelectionRowMode.Multiple;

        this.checkAuthorization$ = this.permissionCheck.checkAuthorization('OE_EDIT_TAGS')
            .subscribe(authorized => {

                if (authorized) {
                    this.dataGrid.ActionButtons = [
                        new DGActionButton("Delete", AppLocalization.Delete, new DGActionButtonConfirmSettings(AppLocalization.DeleteTagAlert, AppLocalization.Delete))
                    ];
                }

            });

        this.BigDataSource = tags.map((tag: any, index: number) => {
            return {
                'Id': tag['Id'],
                'IdUnit': tag.LogicDevice.IdUnit,

                'Number': index + 1,
                'LogicTagType': tag['LogicTagType'],
                'TagType': tag['TagType'],
                'LogicDevice': tag['LogicDevice'],

                'Source': tag['TagType']['Id'] == 0 ?
                            { 'Name': tag['Device']['DisplayName'], 'Id': tag['Device']['Id'], IsLink: true }
                            :
                            { 'Name': tag['Script']['Name'], 'Id': tag['Script']['Id'] },
                // 'Source': tag['TagType']['Id'] == 0 ? tag['Device'] : tag['Script'],
                'MeasureChannel': tag['TagType']['Id'] == 0 ?
                            {'Name': tag['DeviceTagType']['Name'], 'Id': tag['DeviceTagType']['Id']}
                            :
                            {'Name': tag['ScriptVariable']['Name'], 'Id': tag['ScriptVariable']['Id']},

                'Threshold': tag['Threshold'] || {Name: AppLocalization.NotSpecified, Id: 'NotPointed'},
                'TagValueFilter': tag['TagValueFilter'] || {Name: AppLocalization.NotSpecified, Id: 'NotPointed'},
                'SubSystem': tag['SubSystem'] || {Name: AppLocalization.NotSpecified, Id: 'NotPointed'}
            };
        });

        // this.BigDataSource = tags;

        this.dataGrid.Columns = [
            {
                Name: 'Number',
                Caption: '№',
                AppendFilter: false,
                Width: 70
            },
            {
                Name: 'LogicTagType',
                AggregateFieldName: ['Code', 'Name', 'ValueName'],
                Caption: AppLocalization.Label51,
                CellTemplate: this.logicTagTypeColumnTemplate
            },
            {
                Name: 'TagType', //
                AggregateFieldName: ['Name'],
                Caption: AppLocalization.Type,
                CellTemplate: this.tagTypeColumnTemplate,
                AppendFilter: false
            },
            {
                Name: 'Source', //
                AggregateFieldName: ['Name'],
                Caption: AppLocalization.Source,
                CellTemplate: this.sourceColumnTemplate,
                AppendFilter: false
            },
            {
                Name: 'MeasureChannel', //
                AggregateFieldName: ['Name'],
                CellTemplate: this.measureChannelColumnTemplate,
                Caption: AppLocalization.MeasuringChannel,
                AppendFilter: false
            },
            {
                Name: 'Threshold', //
                AggregateFieldName: ['Name'],
                CellTemplate: this.thresholdColumnTemplate,
                Caption: AppLocalization.Limitations,
                AppendFilter: false
            },
            {
                Name: 'TagValueFilter',
                AggregateFieldName: ['Name'],
                CellTemplate: this.filterTagTypeColumnTemplate,
                Caption: AppLocalization.Filter,
                AppendFilter: false
            },
            {
                Name: 'SubSystem',
                AggregateFieldName: ['Name'],
                CellTemplate: this.subSystemColumnTemplate,
                Caption: AppLocalization.Subsystem,
                AppendFilter: false
            },
        ];

        this.dataGrid.DataSource = this.BigDataSource;

        this.initExportOptions();
    }

    initFilter(tags: any[]) {
        this.filtersContainerService.filtersService.setUniqueColumnValues(tags);

        this.filtersContainerService.filtersNewService.setUniqueColumnValues(tags);
        this.filtersContainerService.filtersNewService.setStorageArray(0, this.filtersContainerService.filtersNewService.uniqueColumnValues['Source']['Value']);
        this.filtersContainerService.filtersNewService.setStorageArray(1, this.filtersContainerService.filtersNewService.uniqueColumnValues['LogicTagType']['Value']);
        this.filtersContainerService.filtersNewService.setStorageArray(2, this.filtersContainerService.filtersNewService.uniqueColumnValues['Threshold']['Value']);

        this.showFilter = true; // обязательно должен быть после инициализации значений всех фильтров
    }

    initExportOptions() {
        let exportOptions = new ExportXlsxOptions();
        exportOptions.fileName = AppLocalization.Tags.toLowerCase();
        exportOptions.exportColsInfo = [
            {
                name: "A",
                wpx: 50
            },
            {
                name: "B",
                wpx: 450
            },
            {
                name: "C",
                wpx: 450
            },
            {
                name: "D",
                wpx: 450
            },
            {
                name: "E",
                wpx: 70
            }
        ];
        this.dataGrid.ExportXlsxOptions = exportOptions;
    }

    onDGRowActionBttnClick(button: any) {
        if (button.action == 'Delete') {
            this.deleteDGRow(button);
        } else {}
    }

    deleteDGRow(button: any) {
        // на этой строке удаляем строку с айдишником button.item.Id на сервере
        this.deleteTags([button.item.Id]);
    }

    deleteRows() {
        let selectedRows: any[] = this.dataGrid.getSelectDataRows();
        // на этой строке удаляем строки с айдишниками из selectedRows на сервере
        this.deleteTags(selectedRows.map((t: any) => t.Id));
    }

    deleteTags(tags: any[]) {
        this.loadingContentPanel = true;
        this.tagsEditorService
            .post(tags, `${this.ldId}/delete`)
            .then((res: any) => {
                this.loadingContentPanel = false;
                this.renderTagsFromBackEnd(); // ререндерим заново строки с бэкенда
            })
            .catch((error: any) => {
                this.loadingContentPanel = false;
                this.DGErrors.push(error);
            });
    }

    onApplyFilter(filters: any[]) {
        let filter = {};
        (filters || []).forEach((f: any) => {
            let val = f.Value;
            filter[f.Code + '|Id'] = val.map((item: any) => { return item.Id; });
            // filter[f.Code] = val.map((item: any) => { return item.Id });
        });
        this.loadingContentPanel = true;
        setTimeout(() => {
            this.setFilter(filter)
                .then(() => this.loadingContentPanel = false);
        }, 100);
    }

    setFilter(filter: any): Promise<boolean> {
        return new Promise((resolve, reject) => {
            try {
                this.dataGrid.DataSource = this.Filter.transform(this.BigDataSource, '', filter);
                resolve();
            } catch (e) {
                reject(e);
            }
        });
    }

    tagsOrder() {
        this.router.navigate([`/lde-tags-sorting/${this.ldId}`]);
    }
    addTags() {
        this.goToTagsEditPanel('new');
    }
    editRows() {
        let rows = this.dataGrid.getSelectDataRows();

        this.goToTagsEditPanel('edit', rows.map((r: any) => r.Id).join());
    }
    private goToTagsEditPanel(mode: string, ids?: string) {
        this.router.navigate([`lde-tags-editor/${this.ldId}`],
            {
                queryParams: { mode: mode, ids: ids }
            });
    }
}