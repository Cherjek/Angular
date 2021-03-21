import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, Input, ViewChild, OnDestroy, Output, EventEmitter, TemplateRef } from '@angular/core';
import * as GridControls from '../../../../controls/DataGrid';
import DataGrid = GridControls.DataGrid;
import SelectionRowMode = GridControls.SelectionRowMode;
import { DataItem } from '../../components/data-presentation-create/data-presentation-create.component';
import { Subscription, ReplaySubject } from 'rxjs';
import { IHierarchyNodeView } from '../../../../services/additionally-hierarchies';

@Component({
    selector: 'rom-data-presentation-grid',
    templateUrl: './data-presentation-grid.component.html',
    styleUrls: ['./data-presentation-grid.component.less']
})
export class DataPresentationGridComponent implements OnInit, OnDestroy {
    private subject: ReplaySubject<object> = new ReplaySubject<object>(0);
    private subscription: Subscription;
    private _dataTreeSource: IHierarchyNodeView[];
    
    @ViewChild('Ro5DataGrid', { static: true }) dataGrid: DataGrid;
    @ViewChild('cellTemplateNode', { static: true }) cellTemplateNode: TemplateRef<any>;
    @ViewChild('cellTemplateLogicDevice', { static: true }) cellTemplateLogicDevice: TemplateRef<any>;
    @ViewChild('cellTemplateTag', { static: true }) cellTemplateTag: TemplateRef<any>;

    @Input() nodesNameFiled: string;
    @Input() set dataTreeSource(dataTreeSource: IHierarchyNodeView[]) {
        this._dataTreeSource = dataTreeSource;
        this.initDataGrid(this.parseGeoPermissionsTreeToDataGrid(dataTreeSource));
    }
    get dataTreeSource(): IHierarchyNodeView[] {
        return this._dataTreeSource;
    }
    @Input() filterByKey: string;
    private _filterQuery: string;
    @Input() set filterQuery(filterQuery: string) {
        this._filterQuery = filterQuery;
        this.subject.next({ [this.filterByKey]: this._filterQuery });
    }
    get filterQuery(): string {
        return this._filterQuery;
    }


    @Output() public onBasketMove: EventEmitter<number[]> = new EventEmitter<number[]>();

    ngOnInit() {
        setTimeout(() => {
            this.subscription = this.subject.subscribe(
                (response) => {
                    this.dataGrid.Filter = response;
                }
            );
        }, 1000);
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    /**
     * Инициализация таблицы
     * @param dataSource GeoPermissionsDataGrid[]
     */
    private initDataGrid(dataSource: INodesDataGrid[]): void {
        this.dataGrid.KeyField = 'id';
        this.dataGrid.SelectionRowMode = SelectionRowMode.Multiple;
        this.dataGrid.Columns = [
            {
                Name: 'nodes',
                Caption: this.nodesNameFiled || AppLocalization.Node,
                CellTemplate: this.cellTemplateNode,
            },
            {
                Name: 'logicDevices',
                Caption: AppLocalization.Label32,
                CellTemplate: this.cellTemplateLogicDevice,

            },
            {
                Name: 'tags',
                Caption: AppLocalization.Tag,
                CellTemplate: this.cellTemplateTag,

            }
        ];
        this.dataGrid.DataSource = dataSource;
    }

    /*
     * выбранные записи кидаем в корзину
     */
    public onBasketItemAdd() {
        const ids = this.dataGrid.getSelectDataRows().map(item => item[this.dataGrid.KeyField]);
        this.onBasketMove.emit(ids);
    }

    /**
     * Преобразуем geoPermissions в табличный вид
     * @param geoPermissions GeoPermissions[]
     * @returns GeoPermissionsDataGrid[]
     */
    private parseGeoPermissionsTreeToDataGrid(nodes: IHierarchyNodeView[]): INodesDataGrid[] {
        const data: INodesDataGrid[] = [];
        nodes.forEach((node) => {
            node.LogicDevices.forEach((logicDevice) => {
                logicDevice.Tags.forEach((tag) => {
                    data.push({
                        nodes: node.DisplayName,
                        logicDevices: logicDevice.DisplayName,
                        tags: `${tag.Code} ${tag.Name} ${tag.UnitName}`,
                        id: tag.Id,
                    });
                });
            });
        });
        return data;
    }
}

export interface INodesDataGrid extends DataItem {
    id: number;
}