import { AppLocalization } from 'src/app/common/LocaleRes';
import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { LogicDeviceEditorTagsService } from "../../../services/objecteditors.module/logicDevice.editor/lde.tags/LogicDeviceEditorTags";
import { Subscription } from "rxjs/index";
import { ActivatedRoute } from "@angular/router";
import { DataGrid } from "../../../controls/DataGrid";

import { TagsEditorService } from "../../../services/objecteditors.module/tags.editor/TagsEditor.service";

import { GlobalValues } from '../../../core';

@Component({
    selector: 'tags-sorting',
    templateUrl: './tags.sorting.html',
    styleUrls: ['./tags.sorting.css'],
    providers: [TagsEditorService]
})

export class TagsSortingComponent implements OnInit {
    subscription: Subscription;
    loadingContentPanel: boolean;
    DGErrors: any[] = [];

    ldId: number;
    BigDataSource: any[];
    cacheDataSource: any[];
    DGRowsOrderChange: boolean = false;

    @ViewChild('Ro5DataGrid', { static: true }) dataGrid: DataGrid;
    @ViewChild('LogicTagTypeColumnTemplate', { static: true }) logicTagTypeColumnTemplate: TemplateRef<any>;
    @ViewChild('TagTypeColumnTemplate', { static: true }) tagTypeColumnTemplate: TemplateRef<any>;
    @ViewChild('SourceColumnTemplate', { static: true }) sourceColumnTemplate: TemplateRef<any>;
    @ViewChild('MeasureChannelColumnTemplate', { static: true }) measureChannelColumnTemplate: TemplateRef<any>;
    @ViewChild('ThresholdColumnTemplate', { static: true }) thresholdColumnTemplate: TemplateRef<any>;
    @ViewChild('NumberColumnTemplate', { static: true }) numberColumnTemplate: TemplateRef<any>;


    constructor(public ldeTagsService: LogicDeviceEditorTagsService,
                public tagsEditorService: TagsEditorService,
                public activatedRoute: ActivatedRoute) {
        this.subscription = this.activatedRoute.params.subscribe(params => {
            this.ldId = params['id'];
        });
    }

    ngOnInit() {
        this.loadingContentPanel = true;
        this.ldeTagsService.getTags(this.ldId ).subscribe(
            (tags: any) => {
                this.initDG(tags);
                this.loadingContentPanel = false;
            },
            (error: any) => {
                this.loadingContentPanel = false;
                this.DGErrors.push(error);
            }
        );
    }

    initDG(tags: any[]) {
        this.cacheDataSource = [].concat(tags);

        this.dataGrid.initDataGrid();
        this.dataGrid.KeyField = 'Id';

        this.BigDataSource = tags.map((tag: any, index: number) => {
            return {
                'Id': tag['Id'],
                'InputDisable': false,

                'Number': index + 1,
                'LogicTagType': tag['LogicTagType'],
                'TagType': tag['TagType'],
                'LogicDevice': tag['LogicDevice'],

                'Source': tag['TagType']['Id'] == 0 ?
                    {'Name': tag['Device']['DisplayName'], 'Id': tag['Device']['Id']}
                    :
                    {'Name': tag['Script']['Name'], 'Id': tag['Script']['Id']},
                // 'Source': tag['TagType']['Id'] == 0 ? tag['Device'] : tag['Script'],
                'MeasureChannel': tag['TagType']['Id'] == 0 ?
                    {'Name': tag['DeviceTagType']['Name'], 'Id': tag['DeviceTagType']['Id']}
                    :
                    {'Name': tag['ScriptVariable']['Name'], 'Id': tag['ScriptVariable']['Id']},

                'Threshold': tag['Threshold'] || {Name: AppLocalization.NotSpecified, Id: 'NotPointed'}
            };
        });

        this.dataGrid.Columns = [
            {
                Name: 'Number',
                Caption: '№',
                CellTemplate: this.numberColumnTemplate,
                AppendFilter: false,
                Width: 100,
                Sortable: 1
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
                Caption: AppLocalization.Thresholds,
                AppendFilter: false
            }
        ];

        this.dataGrid.DataSource = this.BigDataSource;
    }

    sortDG() {
        this.dataGrid.setColumnSort("Number", 1);
        this.DGRowsOrderChange = true;
        // this.dataGrid.resizeGrid();
    }

    disableLeftInputs(item: any) {
        /*this.dataGrid.DataSource.forEach((row) => {
            if (row['Id'] != item['Id']) {
                row['InputDisable'] = true;
            }
        });*/

        for (let i = 0; i < this.dataGrid.DataSource.length; i++) {
            let row: any = this.dataGrid.DataSource[i];
            if (row['Id'] != item['Id']) {
                if (row['InputDisable'] == true) {
                    break;
                } else {
                    row['InputDisable'] = true;
                }
            }
        }
    }

    enableAllInputs() {
        this.dataGrid.DataSource.forEach((row) => {
            row['InputDisable'] = false;
        });
    }

    recountOrders(newOrder: number | string, item: any) {
        /**
         * Добавить алгоритм пересчета значений здесь
         */

        let oldOrder: number; // предыдущее значение поля Number

        let changedRowId: number = item['Id'];
        let changedRowInd: number = this.dataGrid.DataSource.findIndex((item: any) => { // индекс строки с измененным полем Number
            return item['Id'] == changedRowId;
        });

        if (this.dataGrid.DataSource[changedRowInd - 1]) {
            oldOrder = this.dataGrid.DataSource[changedRowInd - 1]['Number'] + 1;
        } else if (this.dataGrid.DataSource[changedRowInd + 1]) {
            oldOrder = this.dataGrid.DataSource[changedRowInd + 1]['Number'] - 1;
        }

        if (newOrder !== null &&
            newOrder != "") { // пересчитываем значения поля Number в других строках
            if (newOrder < oldOrder) {
                for (let i = oldOrder; i > newOrder; i--) {
                    this.dataGrid.DataSource[i - 2]['Number']++;
                }

                this.sortDG();
            } else if (newOrder > oldOrder) {
                for (let i = oldOrder; i < newOrder; i++) {
                    this.dataGrid.DataSource[i]['Number']--;
                }

                this.sortDG();
            } else { // ввели то же значение что и было
                // сортировка не нужна
                // о footer-е думать не надо
                // о resizeGrid тоже думать не надо
            }
        } else { // нажали крестик либо стерли содержимое инпута
            this.dataGrid.DataSource[oldOrder - 1]['Number'] = oldOrder; // восстанавливаем значение
            // сортировка не нужна
            // о footer-е думать не надо
            // о resizeGrid тоже думать не надо
        }

        this.enableAllInputs();
    }

    onDragAndDrop(event: any) {
        let newOrder: number = event.currentIndex + 1;
        let oldOrder: number = event.previousIndex + 1;

        if (newOrder < oldOrder) {
            for (let i = oldOrder; i > newOrder; i--) {
                this.dataGrid.DataSource[i - 2]['Number']++;
            }

            this.dataGrid.DataSource[oldOrder - 1]['Number'] = newOrder;
            this.sortDG();
        } else if (newOrder > oldOrder) {
            for (let i = oldOrder; i < newOrder; i++) {
                this.dataGrid.DataSource[i]['Number']--;
            }
            this.dataGrid.DataSource[oldOrder - 1]['Number'] = newOrder;
            this.sortDG();
        } else { // ввели то же значение что и было
            // сортировка не нужна
            // о footer-е думать не надо
            // о resizeGrid тоже думать не надо
        }
    }

    saveSort() {
        let rows = this.dataGrid.getDataRows();

        let sortArray: any[] = [];
        rows
            .map((tv: any) => tv.Id)
            .forEach((id: number) => {
                let _tv = this.cacheDataSource.find((tvc: any) => id === tvc.Id);
                if (_tv) {
                    let index = this.cacheDataSource.indexOf(_tv);
                    let _moveItem = this.cacheDataSource.splice(index, 1);

                    sortArray.push(_moveItem[0]);
                }
            });

        let request = {
            IdLogicDevice: this.ldId,
            Method: 'sort',
            Tags: sortArray
        }

        this.loadingContentPanel = true;

        this.tagsEditorService
            .post(request)
            .then((result: any) => {
                this.loadingContentPanel = false;
                this.back();
            })
            .catch((error: any) => {
                this.loadingContentPanel = false;
                this.DGErrors.push(error);
            });
    }

    back() {
        GlobalValues.Instance.Page.backwardButton.navigate();
    }
}
