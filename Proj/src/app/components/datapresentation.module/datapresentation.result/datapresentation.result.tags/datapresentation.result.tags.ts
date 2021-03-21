import { AppLocalization } from 'src/app/common/LocaleRes';
import { DetailsRowComponent } from './../../../../controls/ListComponentCommon/DetailsRow/DetailsRow';
import { DataGrid } from './../../../../controls/DataGrid/DataGrid';
import { Component, OnInit, OnDestroy, Input, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { DataResultSettingsService } from '../../../../services/datapresentation.module/DataResultSettings.service';
import { ObjectUnitTagsService } from '../../../../services/datapresentation.module/ObjectUnitTags.service';

import { GlobalValues } from '../../../../core';
import { storagePageTitle } from
    '../datapresentation.result.data/datapresentation.result.data';
import { Subscription } from 'rxjs';
import { DetailsRow } from 'src/app/controls/ListComponentCommon/DetailsRow/DetailsRow';
import { DatapresentationResultInnerTagsComponent } from '../datapresentation-result-inner-tags/datapresentation-result-inner-tags.component';

declare var $: any;

@Component({
    selector: 'frame-datapresentation-result-tags',
    templateUrl: 'datapresentation.result.tags.html',
    styleUrls: ['datapresentation.result.tags.css']
})

export class DatapresentationResultTagsComponent implements OnInit, OnDestroy {
    data$: Subscription;
    @Input('IsEmbedded') IsEmbedded = false;
    @ViewChild('Ro5DataGrid', {static: false}) dataGrid: DataGrid;
    @ViewChild('cellTag', { static: false }) cellTag: TemplateRef<any>;
    @ViewChild('cellUnit', { static: false }) cellUnit: TemplateRef<any>;
    private _DataSource: any;
    CanAddTagValue: boolean;
    @Input('DataSource')
    public get DataSource(): any {
        return this._DataSource;
    }
    public set DataSource(value: any) {
        if(value) {
            GlobalValues.Instance.Page.dataPresTags = value;
            this.CanAddTagValue = true;
        } else {
            this.CanAddTagValue = false;
        }
        this._DataSource = value;
    }

    constructor(
        private router: Router,
        private objectUnitTagsService: ObjectUnitTagsService,
        private dataResultSettingsService: DataResultSettingsService) { }

    public objectUnitTags: any[];

    public loadingContentPanel: boolean = false;
    public errorsTagsLoad: any[] = [];  
    private get isHierarchy() {
        return this.router.url.startsWith('/hierarchy');
    }
    private dataService() {
        if (this.isHierarchy) {
            return this.objectUnitTagsService.hierarchyDataPresentService(GlobalValues.Instance.hierarchyApp.Id);
        } else {
            return this.objectUnitTagsService.dataPresentService();
        }
    }  

    ngOnInit() {
        this.loadData();

        setTimeout(() => {
            GlobalValues.Instance.Page = { Info: localStorage.getItem(storagePageTitle) };
        }, 0);        
    }
    ngOnDestroy() {
        if (this.data$) {
            this.data$.unsubscribe();
        }
    }

    initDataGrid() {
        if(this.dataGrid) {
            this.dataGrid.KeyField = "TagId";
            this.dataGrid.Columns = [
                {
                    Name: "LogicDeviceDisplayText",
                    Caption: `${AppLocalization.Object} > ${AppLocalization.Label32}`,
                    CellTemplate: this.cellUnit
                },
                {
                    Name: "TagCode",
                    AggregateFieldName: ["TagName"],
                    Caption: AppLocalization.Tag,
                    CellTemplate: this.cellTag,
                },
            ]
        };
        const detailsRow = new DetailsRow();
        detailsRow.components = [
            new DetailsRowComponent(AppLocalization.AddTagValue, DatapresentationResultInnerTagsComponent, {
                objectUnitTags: this.objectUnitTags,
                dataGrid: this.dataGrid
            })
        ];
        this.dataGrid.DetailRow = detailsRow;
        this.dataGrid.DataSource = this.objectUnitTags;
    }

    private loadData() {
        this.loadingContentPanel = true;

        let settings = this.dataResultSettingsService.getSettings();
        let tagIds = settings.tags;

        this.data$ = this.dataService()
            .get(tagIds)
            .subscribe(
                (data: any) => {
                    this.objectUnitTags = data;
                    this.loadingContentPanel = false;

                    if(this.IsEmbedded) {
                        this.initDataGrid();
                    }
                },
                (error: any) => {
                    this.loadingContentPanel = false;
                    this.errorsTagsLoad.push(error);
                }
            );
    }
}