import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, Input, OnInit, AfterContentChecked, OnDestroy, OnChanges, SimpleChanges, ViewChild, TemplateRef } from '@angular/core';
import { AmChartsService, AmChart } from "@amcharts/amcharts3-angular";

import * as ControlGrid from '../../../../../controls/DataGrid';
import DataGrid = ControlGrid.DataGrid;
import DataGridColumn = ControlGrid.DataGridColumn;
import DGDataColumnType = ControlGrid.DataColumnType;
import DGSelectionRowMode = ControlGrid.SelectionRowMode;

import { FilterValue, FilterOperationType } from '../../../../../common/models/Filter/FilterValue';

import { Utils } from '../../../../../core';

declare var $: any;

const heightGraphPanel = 360;
const categoriesFieldName = "Datetime";
const offsetValueAxes = 50;
const maxTagGraphsAmt = 10;

@Component({
    selector: 'frame-datapresentation-result-data-graph',
    templateUrl: 'datapresentation.result.data.graph.html',
    styleUrls: ['datapresentation.result.data.graph.css']
})

export class DatapresentationResultDataGraphComponent implements AfterContentChecked, OnInit, OnDestroy, OnChanges {

    private BigDataSource: any[];

    private _dataSource: any[];
    @Input()
    get DataSource(): any[] {
        return this._dataSource;
    }
    set DataSource(items: any[]) {

        this.BigDataSource = items;

        let results: any = [];
        if (items) {
            let groupItems = {};
            items.forEach((item: any) => {

                if (!groupItems[item.TagId]) groupItems[item.TagId] = {};
                if (!groupItems[item.TagId][item.IdLogicDevice]) groupItems[item.TagId][item.IdLogicDevice] = {};

                if (!groupItems[item.TagId][item.IdLogicDevice][item.IdUnit]) {
                    groupItems[item.TagId][item.IdLogicDevice][item.IdUnit] = 1;
                    results.push(item);
                }
            });
        }
        this._dataSource = results;
    }

    private _dataSourceGraph: any[];
    get DataSourceGraph(): any[] {
        return this._dataSourceGraph;
    }
    set DataSourceGraph(vals: any[]) {

        this._dataSourceGraph = vals;

        let filters: FilterValue[] = [];
        (vals || []).forEach((item: any) => {
            filters.push(new FilterValue(item.TagId, FilterOperationType.NotEqual));
        });
        this.FilterTable = filters.length ? { TagId: filters } : null;
    }

    public showGraphPanel: boolean;
    private heightGraphPanel: number = heightGraphPanel;

    public itemTagsGraph: any = {};

    @ViewChild('Ro5DataGridGraph', { static: true }) dataGridGraph: DataGrid;
    @ViewChild('Ro5DataGrid', { static: true }) dataGrid: DataGrid;
    @ViewChild('cellUnit', { static: true }) cellUnit: TemplateRef<any>;
    @ViewChild('cellTag', { static: true }) cellTag: TemplateRef<any>;
    @ViewChild('cellTagColor', { static: true }) cellTagColor: TemplateRef<any>;

    FilterTable: any;
    private panelSplitter: any;
    private chart: AmChart;
    public loadingGraphViewPanel: boolean;
    public isNotVisibleTagsGrid: boolean;

    readonly DGSelectionRowMode = DGSelectionRowMode;

    constructor(private AmCharts: AmChartsService) {
    }

    ngOnInit() {

        let columns: any[] = [
            {
                Name: "TagCode",
                //AggregateFieldName: ["TagName"],
                Caption: AppLocalization.Tag,
                CellTemplate: this.cellTag,
                Width: 400
            },
            {
                Name: "LogicDeviceDisplayText",
                //AggregateFieldName: ["UnitDisplayText"],
                Caption: `${AppLocalization.Object} > ${AppLocalization.Label32}`,
                CellTemplate: this.cellUnit
            }
        ];

        this.dataGrid.Columns = columns;
        columns.splice(1, 0, {
            CellTemplate: this.cellTagColor,
            Width: 50
        });
        this.dataGridGraph.Columns = columns;
    }
    ngAfterContentChecked(): void {
        let count = this.dataGrid.getItemsLength();
        this.isNotVisibleTagsGrid = this.selLimit === 0 || count === 0;
    }
    ngOnChanges(sc: SimpleChanges) {
        if (sc.DataSource) {
            this.updateTagsGraph();
        }
    }
    ngOnDestroy() {
        if (this.chart) {
            this.AmCharts.destroyChart(this.chart);
        }
    }

    createTagsGraph(popup: any) {
        let tags = this.dataGrid.getSelectDataRows();
        //if (popup && tags.length >= 10) popup.open();
        //else {
            if (this.DataSourceGraph && this.DataSourceGraph.length) {
                tags = (tags || []).concat(this.DataSourceGraph);
            }
            this.DataSourceGraph = tags;
        //}
    }

    updateTagsGraph() {
        if ((this.DataSource || []).length) {
            if (this.showGraphPanel) {
                this.DataSourceGraph = this.DataSource.filter((ds: any) => {
                    return this.DataSourceGraph.find((dsg: any) => dsg.TagId === ds.TagId) != null;
                });
            }
        }
    }

    public get selLimit(): number {
        return maxTagGraphsAmt - (this._dataSourceGraph || []).length;
    }

    public getPixelHeightGraph(panel: any) {
        return $(panel).height() || this.heightGraphPanel;
    }

    private generateChartData = (): any[] => {
        this.itemTagsGraph = {};
        let results: any[] = [];
        let linkSource = {};
        let tagIds = this.DataSourceGraph.map(tag => tag.TagId);
        (this.BigDataSource || []).forEach((data: any) => {
            if (tagIds.find(tagId => tagId === data.TagId)) {
                if (!linkSource[data[categoriesFieldName]]) {
                    let result = {};
                    result[categoriesFieldName] = data[categoriesFieldName];
                    results.push(result);
                    linkSource[data[categoriesFieldName]] = results[results.length - 1];
                }

                if (!linkSource[data[categoriesFieldName]][data.TagId]) {
                    let result = linkSource[data[categoriesFieldName]];
                    result[data.TagId] = data.Value;                    

                    if (!this.itemTagsGraph[data.TagId]) {
                        this.itemTagsGraph[data.TagId] = { Color: null };
                    }
                }
            }                        
        });
        //results.forEach((res: any) => {
        //    tagIds.forEach((tagId: string) => {
        //        if (res[tagId] === undefined) res[tagId] = 0.1;
        //    });
        //});

        return results.sort((first, second) => {
            if (first[categoriesFieldName] < second[categoriesFieldName]) return -1;
            if (first[categoriesFieldName] > second[categoriesFieldName]) return 1;
            return 0;
        });
    }
    
    clearTagsGraph() {
        let tags = this.dataGridGraph.getSelectDataRows();
        if ((tags || []).length) {
            this.DataSourceGraph = this.DataSourceGraph
                .filter((tag: any) => { return tags.find(t => t.TagId === tag.TagId) == null });
        }
        else {
            this.DataSourceGraph = [];
        }
    }
    onDataGraphBinding(event: any) {
        
        setTimeout(() => {
            this.showGraphPanel = (this.DataSourceGraph || []).length > 0;
            this.resizePanel();
            this.createCharts();
        }, 100);
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
            this.dataGridGraph.resizeGrid();
            this.dataGrid.resizeGrid();
        }, 100);
    }
    createSplitter() {
        this.panelSplitter = $("#panelGraph").split({
            orientation: 'horizontal',
            limit: 200,
            position: heightGraphPanel,//'50%', // if there is no percentage it interpret it as pixels
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
        if (this.showGraphPanel) {      
            this.loadingGraphViewPanel = true;
            setTimeout(() => {
                /*this.generateChartData()*/this.initCharts();
                this.loadingGraphViewPanel = false;
            }, 100);
        }
    }

    /*
     * CHARTS
     * 
     * 
     */
    initCharts() {
        //var chart: any;
        
        // generate some random data first
        let results = this.generateChartData();

        let optionsChart = {
            "type": "serial",
            "theme": "light",
            "dataProvider": results,
            "language": "ru",
            "pathToImages": "assets/amcharts/images/",
            "chartScrollbar": {
                "updateOnReleaseOnly": true
            },
            "listeners": [{ "event": "drawn", "method": (event: any) => {
                    $(event.chart.div).find('.amcharts-chart-div').css({'width':'100%'});
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
            },
            /*"valueAxes": [{
                axisColor: "#FF6600",
                axisThickness: 2

            },
            {
                axisColor: "#FCD202",
                axisThickness: 2,
                offset: 50
                },
                {
                axisColor: "#B0DE09",
                axisThickness: 2

            }],
            "graphs": [
                {   
                    valueAxis: {},
                    title: "blue line",
                    valueField: "visits",
                    bullet: "round",
                    hideBulletsCount: 30,
                    bulletBorderThickness: 1
                },
                {
                    valueAxis: {},
                    title: "yellow line",
                    valueField: "hits",
                    bullet: "square",
                    hideBulletsCount: 30,
                    bulletBorderThickness: 1
                },
                {
                    valueAxis: {},
                    title: "green line",
                    valueField: "views",
                    bullet: "triangleUp",
                    hideBulletsCount: 30,
                    bulletBorderThickness: 1
                }]*/
        }
        //optionsChart["graphs"][0].valueAxis = optionsChart["valueAxes"][0];
        //optionsChart["graphs"][1].valueAxis = optionsChart["valueAxes"][1];
        //optionsChart["graphs"][2].valueAxis = optionsChart["valueAxes"][2];

        let colorGenerator = new Utils.RandomColorGenerator();
        colorGenerator.STEP = 32;

        if (results && results.length) {            

            let offsetAxes = 0;
            let keys = Object.keys(this.itemTagsGraph);
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

                    this.itemTagsGraph[key].Color = graphs.lineColor = valueAxes.axisColor = colorGenerator.getColor();

                    offsetAxes += offsetValueAxes;
                }

            });
        }

        this.chart = this.AmCharts.makeChart("charttags", optionsChart);
        /*this.AmCharts.ready(function () {
            

            // SERIAL CHART
            chart = new AmCharts.AmSerialChart();

            chart.dataProvider = chartData;
            chart.categoryField = "date";

            // listen for "dataUpdated" event (fired when chart is inited) and call zoomChart method when it happens
            chart.addListener("dataUpdated", zoomChart);

            chart.synchronizeGrid = true; // this makes all axes grid to be at the same intervals

            // AXES
            // category
            var categoryAxis = chart.categoryAxis;
            categoryAxis.parseDates = true; // as our data is date-based, we set parseDates to true
            categoryAxis.minPeriod = "DD"; // our data is daily, so we set minPeriod to DD
            categoryAxis.minorGridEnabled = true;
            categoryAxis.axisColor = "#DADADA";
            categoryAxis.twoLineMode = true;
            categoryAxis.dateFormats = [{
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
            }];

            // first value axis (on the left)
            var valueAxis1 = new AmCharts.ValueAxis();
            valueAxis1.axisColor = "#FF6600";
            valueAxis1.axisThickness = 2;
            chart.addValueAxis(valueAxis1);

            // second value axis (on the right)
            var valueAxis2 = new AmCharts.ValueAxis();
            valueAxis2.position = "right"; // this line makes the axis to appear on the right
            valueAxis2.axisColor = "#FCD202";
            valueAxis2.gridAlpha = 0;
            valueAxis2.axisThickness = 2;
            chart.addValueAxis(valueAxis2);

            // third value axis (on the left, detached)
            var valueAxis3 = new AmCharts.ValueAxis();
            valueAxis3.offset = 50; // this line makes the axis to appear detached from plot area
            valueAxis3.gridAlpha = 0;
            valueAxis3.axisColor = "#B0DE09";
            valueAxis3.axisThickness = 2;
            chart.addValueAxis(valueAxis3);

            // GRAPHS
            // first graph
            var graph1 = new AmCharts.AmGraph();
            graph1.valueAxis = valueAxis1; // we have to indicate which value axis should be used
            graph1.title = "red line";
            graph1.valueField = "visits";
            graph1.bullet = "round";
            graph1.hideBulletsCount = 30;
            graph1.bulletBorderThickness = 1;
            chart.addGraph(graph1);

            // second graph
            var graph2 = new AmCharts.AmGraph();
            graph2.valueAxis = valueAxis2; // we have to indicate which value axis should be used
            graph2.title = "yellow line";
            graph2.valueField = "hits";
            graph2.bullet = "square";
            graph2.hideBulletsCount = 30;
            graph2.bulletBorderThickness = 1;
            chart.addGraph(graph2);

            // third graph
            var graph3 = new AmCharts.AmGraph();
            graph3.valueAxis = valueAxis3; // we have to indicate which value axis should be used
            graph3.valueField = "views";
            graph3.title = "green line";
            graph3.bullet = "triangleUp";
            graph3.hideBulletsCount = 30;
            graph3.bulletBorderThickness = 1;
            chart.addGraph(graph3);

            // CURSOR
            var chartCursor = new AmCharts.ChartCursor();
            chartCursor.cursorAlpha = 0.1;
            chartCursor.fullWidth = true;
            chartCursor.valueLineBalloonEnabled = true;
            chart.addChartCursor(chartCursor);

            // SCROLLBAR
            var chartScrollbar = new AmCharts.ChartScrollbar();
            chart.addChartScrollbar(chartScrollbar);

            // LEGEND
            var legend = new AmCharts.AmLegend();
            legend.marginLeft = 110;
            legend.useGraphSettings = true;
            chart.addLegend(legend);

            // WRITE
            chart.write("chartdiv");
        });

        // this method is called when chart is first inited as we listen for "dataUpdated" event
        function zoomChart() {
            // different zoom methods can be used - zoomToIndexes, zoomToDates, zoomToCategoryValues
            chart.zoomToIndexes(10, 20);
        }*/        
    }
}