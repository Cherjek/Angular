import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';

import { DataResultCompareSettingsService } from '../../../services/datapresentation.module/DataResultSettings.service';
import { ObjectTagsValuePivotService } from '../../../services/datapresentation.module/ObjectTagsValuePivot.service';

import { AmChartsService, AmChart } from "@amcharts/amcharts3-angular";

import * as ControlGrid from '../../../controls/DataGrid';
import DataGrid = ControlGrid.DataGrid;
import DataGridColumn = ControlGrid.DataGridColumn;
import DGDataColumnType = ControlGrid.DataColumnType;
import DGSelectionRowMode = ControlGrid.SelectionRowMode;

import { Utils } from '../../../core';
import DateConvert = Utils.DateConvert;
import { Subscription } from 'rxjs';

declare var $: any;

const heightGraphPanel = 360;
const categoriesFieldName = "Datetime";
const offsetValueAxes = 50;
const maxTagsLength = 10;

@Component({
    selector: 'frame-datapresentation-result-tags-pivot',
    templateUrl: 'datapresentation.result.comparetags.html',
    styleUrls: ['datapresentation.result.comparetags.css']
})

export class DatapresentationResultCompareTagsComponent implements OnInit, OnDestroy {
    objectTagsValuePivotService$: Subscription;

    constructor(private objectTagsValuePivotService: ObjectTagsValuePivotService,
        private dataResultCompareSettingsService: DataResultCompareSettingsService,
        private AmCharts: AmChartsService) { }

    public loadingGraphViewPanel: boolean = false;
    public loadingViewPanel: boolean = false;
    private errorsContentValidationForms: any[] = [];
    public showGraphPanel: boolean = false;
    private isCreateGraphPanel: boolean = false;
    private panelSplitter: any;
    private chart: AmChart;
    private heightGraphPanel: number = heightGraphPanel;
    public isButtonGraphShow: boolean = false;


    private tagsColor: any = {};
    public dateRangeHeaderColumn: any = {
        start: "",
        end: ""
    };

    @ViewChild('Ro5DataGrid', { static: true }) dataGrid: DataGrid;
    @ViewChild('colDateTemplate', { static: true }) colDateTemplate: TemplateRef<any>;
    @ViewChild('colTagTemplate', { static: true }) colTagTemplate: TemplateRef<any>;
    @ViewChild('cellTag', { static: true }) cellTag: TemplateRef<any>;

    ngOnInit() {
        this.loadData();
    }
    ngOnDestroy() {    
        this.dataResultCompareSettingsService.removeSettings();
        if (this.objectTagsValuePivotService$) {
            this.objectTagsValuePivotService$.unsubscribe();
        }
    }

    private DataSource: any;
    public Columns: any;

    private initDataGrid() {
        let columns: any[] = [
            {
                Name: "Datetime",
                Caption: AppLocalization.Date,
                DataType: DGDataColumnType.DateTime,
                ColTemplate: this.colDateTemplate,
                Width: 200
            }];

        if (this.Columns) {
            let cols = Object.keys(this.Columns)
            cols.forEach(c => {
                columns.push({
                    Name: c,
                    Caption: this.Columns[c].TagName,
                    ColTemplate: this.colTagTemplate,
                    CellTemplate: this.cellTag
                });

                this.tagsColor[c] = "";
            });
        }
        this.dataGrid.Columns = columns;
        this.dataGrid.DataSource = this.DataSource;        
    }

    private loadData() {
        this.loadingViewPanel = true;

        let settings = this.dataResultCompareSettingsService.getSettings();
        let request = {
            tagIds: settings.tags,
            timestampStart: settings.fromDate != null ? DateConvert.Instance.getTimeOffset(settings.fromDate) : 0,
            timestampEnd: settings.toDate != null ? DateConvert.Instance.getTimeOffset(settings.toDate) : 0
        }

        this.objectTagsValuePivotService$ = this.objectTagsValuePivotService
            .get(request)
            .subscribe(
            (data: any) => {
                    if (data) {
                        if (data["Table"]) {
                            let dates = Object.keys(data["Table"]);
                            this.DataSource = dates
                                .sort((first, second) => {
                                    if (first < second) return -1;
                                    else if (first > second) return 1;
                                    else return 0;
                                })
                                .map(key => data["Table"][key]);
                            if (dates.length) {
                                this.isButtonGraphShow = true;

                                this.dateRangeHeaderColumn.start = dates[0];
                                this.dateRangeHeaderColumn.end = dates[dates.length - 1];
                            }
                        }
                        if (data["Columns"]) this.Columns = data["Columns"];

                        this.initDataGrid();
                    }
                    this.loadingViewPanel = false;
                },
                (error: any) => {
                    this.loadingViewPanel = false;
                }
            );
    }

    public getPixelHeightGraph(panel: any) {
        return $(panel).height() || this.heightGraphPanel;
    }

    public getItemColText(col: any, name: string) {
        return this.Columns[col.Name][name];
    }

    public getTagsHeaderColor(name: string) {
        return this.tagsColor[name] != null && this.showGraphPanel ? this.tagsColor[name] : 'gray';
    }

    createTagsGraph() {
        this.showGraphPanel = !this.showGraphPanel;

        setTimeout(() => {            
            this.loadingGraphViewPanel = true;

            this.resizePanel();
            this.createCharts();
        }, 100);
    }

    onDataGraphBinding(event?: any) {

        
    }

    resizePanel() {
        setTimeout(() => {

            if (this.showGraphPanel) {
                this.createSplitter();
            }
            else {
                this.destroySplitter();
            }

            this.resizeGrids();
        }, 100);
    }
    timeoutGrids: any;
    resizeGrids() {
        clearTimeout(this.timeoutGrids);

        this.timeoutGrids = setTimeout(() => {
            this.dataGrid.resizeGrid();
        }, 400);
    }
    createSplitter() {
        this.panelSplitter = $("#panelGraph").split({
            orientation: 'horizontal',
            limit: 200,
            position: this.heightGraphPanel,//'50%', // if there is no percentage it interpret it as pixels
            onDrag: (event: any) => {
                this.resizeGrids();                
            }
        });
    }
    destroySplitter() {
        if (this.panelSplitter) {
            this.panelSplitter.destroy();
        }
        $("#panelGraph > div:last-child").css({ 'height': 'calc(100%)' });
    }   

    createCharts() {
        if (this.showGraphPanel && !this.isCreateGraphPanel) {
            this.isCreateGraphPanel = true;
            setTimeout(() => {
                this.initCharts();
                this.loadingGraphViewPanel = false;
            }, 100);
        }
        else
            this.loadingGraphViewPanel = false;
    }

    initCharts() {
        //var chart: any;

        // generate some random data first
        let results = this.DataSource;

        let optionsChart = {
            "type": "serial",
            "theme": "light",
            "dataProvider": results,
            "language": "ru",
            "pathToImages": "assets/amcharts/images/",
            "chartScrollbar": {
                "updateOnReleaseOnly": true
            },
            "listeners": [{
                "event": "drawn", "method": (event: any) => {
                    $(event.chart.div).find('.amcharts-chart-div').css({ 'width': '100%' });
                }
            }],
            "legend": {
                marginLeft: 110,
                useGraphSettings: true,
                enabled: false
            },
            "chartCursor": {
                cursorAlpha: 0.1,
                fullWidth: false,
                valueLineBalloonEnabled: true
            },
            "categoryField": categoriesFieldName,
            "categoryAxis": {
                parseDates: true,
                minorGridEnabled: true,
                axisColor: "#DADADA",
                twoLineMode: true,
                firstDayOfWeek: 1,//Mondey
                minPeriod: "mm",
                dateFormats: [{
                    period: 'fff',
                    format: 'JJ:NN:SS'
                }, {
                    period: 'ss',
                    format: 'JJ:NN:SS'
                }, {
                    period: 'mm',
                    format: 'JJ:NN'
                }, {
                    period: 'hh',
                    format: 'JJ:NN'
                }, {
                    period: 'DD',
                    format: 'DD'
                }, {
                    period: 'WW',
                    format: 'DD'
                }, {
                    period: 'MM',
                    format: 'MMM'
                }, {
                    period: 'YYYY',
                    format: 'YYYY'
                }]
            }
        }

        let colorGenerator = new Utils.RandomColorGenerator();
        colorGenerator.STEP = 32;

        if (results && results.length) {            
            let offsetAxes = 0;
            let keys = Object.keys(this.tagsColor);
            keys.forEach(key => {

                if (key !== categoriesFieldName) {
                    if (!optionsChart["valueAxes"]) optionsChart["valueAxes"] = [];
                    let length = optionsChart["valueAxes"].push({
                        axisThickness: 3,
                        offset: offsetAxes
                    });
                    let valueAxes = optionsChart["valueAxes"][length - 1];
                    if (!optionsChart["graphs"]) optionsChart["graphs"] = [];
                    length = optionsChart["graphs"].push({
                        title: key,
                        valueField: key,
                        bullet: "triangleUp",
                        hideBulletsCount: 30,
                        bulletBorderThickness: 1
                    });
                    let graphs = optionsChart["graphs"][length - 1];
                    graphs.valueAxis = valueAxes;

                    this.tagsColor[key] = graphs.lineColor = valueAxes.axisColor = colorGenerator.getColor();

                    offsetAxes += offsetValueAxes;
                }

            });
        }

        this.chart = this.AmCharts.makeChart("charttags", optionsChart);        
    }
}