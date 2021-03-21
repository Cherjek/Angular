import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, Input, ViewChild, OnDestroy, Output, EventEmitter, TemplateRef } from '@angular/core';
import * as GridControls from '../../../../../../../controls/DataGrid';
import DataGrid = GridControls.DataGrid;
import SelectionRowMode = GridControls.SelectionRowMode;
import { FilterData } from '../export-import-units-tree';
import { Subscription, ReplaySubject } from 'rxjs';
import { GeoTree } from '../../../../../../../services/admin.module/interfaces/geo-tree';

@Component({
    selector: 'admin-group-geo-edit-data-grid',
    templateUrl: './admin-group-geo-edit-data-grid.component.html',
    styleUrls: ['./admin-group-geo-edit-data-grid.component.less']
})
export class AdminGroupGeoEditDataGridComponent implements OnInit, OnDestroy {
    @ViewChild('Ro5DataGrid', { static: true }) dataGrid: DataGrid;
    @ViewChild('cellTemplateMacroregion', { static: true }) cellTemplateMacroregion: TemplateRef<any>;
    @ViewChild('cellTemplateRegion', { static: true }) cellTemplateRegion: TemplateRef<any>;
    @ViewChild('cellTemplateBranch', { static: true }) cellTemplateBranch: TemplateRef<any>;
    @ViewChild('cellTemplateEso', { static: true }) cellTemplateEso: TemplateRef<any>;
    private subject: ReplaySubject<object> = new ReplaySubject<object>(0);
    private subscription: Subscription;
    private _dataTreeSource: GeoTree[];
    @Input() set dataTreeSource(dataTreeSource: GeoTree[]) {
        this._dataTreeSource = dataTreeSource;
        this.initDataGrid(this.parseGeoPermissionsTreeToDataGrid(dataTreeSource));
    }
    get dataTreeSource(): GeoTree[] {
        return this._dataTreeSource;
    }
    private _filterBy: FilterData;
    @Input() set filterBy(filterBy: FilterData) {
        this._filterBy = filterBy;
        this.subject.next({ [this.filterBy.key]: this._filterQuery });
    }
    get filterBy(): FilterData {
        return this._filterBy;
    }
    private _filterQuery: string;
    @Input() set filterQuery(filterQuery: string) {
        this._filterQuery = filterQuery;
        this.subject.next({ [this.filterBy.key]: this._filterQuery });
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
    private initDataGrid(dataSource: IGeoPermissionsDataGrid[]): void {
        this.dataGrid.KeyField = 'id';
        this.dataGrid.SelectionRowMode = SelectionRowMode.Multiple;
        this.dataGrid.Columns = [
            {
                Name: 'macroregion',
                Caption: AppLocalization.Macroregion,
                CellTemplate: this.cellTemplateMacroregion,
            },
            {
                Name: 'region',
                Caption: AppLocalization.Region,
                CellTemplate: this.cellTemplateRegion,

            },
            {
                Name: 'branch',
                Caption: AppLocalization.Branch,
                CellTemplate: this.cellTemplateBranch,

            },
            {
                Name: 'eso',
                Caption: AppLocalization.ESO,
                CellTemplate: this.cellTemplateEso,

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
    private parseGeoPermissionsTreeToDataGrid(geoPermissions: GeoTree[]): IGeoPermissionsDataGrid[] {
        let data: IGeoPermissionsDataGrid[] = [];
        geoPermissions.forEach((macroregion) => {
            // macroregion.Nodes.forEach((region) => {
            //     region.Nodes.forEach((branch) => {
            //         branch.Nodes.forEach((eso) => {
            //             data.push({
            //                 macroregion: macroregion.Name,
            //                 region: region.Name,
            //                 branch: branch.Name,
            //                 eso: eso.Name,
            //                 id: eso.Id,
            //             });
            //         });
            //     });
            // });
        });
        return data;
    }
}

export interface IGeoPermissionsDataGrid {
    id: number;
    macroregion: string;
    region: string;
    branch: string;
    eso: string;
}