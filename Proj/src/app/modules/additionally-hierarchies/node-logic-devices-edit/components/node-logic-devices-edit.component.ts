import { Component, OnDestroy, OnInit, ViewChild, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription, Subscriber } from 'rxjs';
import { finalize } from 'rxjs/operators';

import * as GridControls from '../../../../controls/DataGrid';
import DGSelectionRowMode = GridControls.SelectionRowMode;

import { PropertiesPanelComponent } from '../../../../shared/rom-forms';
import { DetailsRowComponent } from '../../../../controls/ListComponentCommon/DetailsRow/DetailsRow';
import { EntityType } from '../../../../services/common/Properties.service';

import { HierarchyEditorFilterContainerService, 
         HierarchyEditorAddFiltersService,
         HierarchyEditorDefFiltersService,
         HierarchiesLogicDevicesEditorService,
         HierarchiesEditorService,
         IHierarchyNodeLogicDevice } from '../../../../services/additionally-hierarchies';
import * as DataObjectModule from '../../../../services/objects.module/Models/DataObject';
import ObjectTableView = DataObjectModule.Services.ObjectsModule.Models.ObjectTableView;

import { GlobalValues } from '../../../../core';
import { AppLocalization } from 'src/app/common/LocaleRes';

enum FieldNameKey { Key, DisplayText, Address, Status, StatusAggregate }

@Component({
    selector: 'node-logic-devices-edit',
    templateUrl: './node-logic-devices-edit.component.html',
    styleUrls: ['./node-logic-devices-edit.component.less'],
    providers: [HierarchyEditorFilterContainerService, HierarchyEditorAddFiltersService, HierarchyEditorDefFiltersService]
})
export class NodeLogicDevicesEditComponent implements OnInit, OnDestroy {
    
    constructor(private hierarchiesEditorService: HierarchiesEditorService,
                private hierarchiesLogicDevicesEditorService: HierarchiesLogicDevicesEditorService,
                private activatedRoute: ActivatedRoute,
                public filterContainerService: HierarchyEditorFilterContainerService) {

        this.urlParamsSubscription = this.activatedRoute.params.subscribe(
            (params: any) => {
                this.idNode = params['id'];
            }
        );
    }
    public DGErrors: any[] = [];
    public BasketErrors: any[] = [];
    public loadingDG: boolean;
    public loadingBasket: boolean;
    private urlParamsSubscription: Subscription;

    public DGSelectionRowMode = DGSelectionRowMode;

    private idNode: number;
    
    public pageInitComplete: boolean;
    private BigDataSrc: IHierarchyNodeLogicDevice[]; // источник данных для корзины
    public BasketSrc: IHierarchyNodeLogicDevice[]; // источник данных для корзины
    public DGSrc: IHierarchyNodeLogicDevice[]; // источник данных для корзины

    @ViewChild('Ro5DataGrid', { static: true }) public dataGrid: any;
    @ViewChild('ObjectsPanel', { static: false }) private basket: any;

    DetailsRowComponents: DetailsRowComponent[] = [
        new DetailsRowComponent(AppLocalization.Properties, PropertiesPanelComponent, EntityType.LogicDevice)
    ];

    ngOnInit() {
        this.pageInit();
    }

    ngOnDestroy() {
        this.urlParamsSubscription.unsubscribe();
    }

    private loadTabData() {
        this.dataGrid.initDataGrid();
        this.dataGrid.Columns = [{
            Name: 'DisplayName'
        }, {
            Name: 'UnitAdditionalInfo'
        }, {
            Name: 'UnitDisplayName'
        }];

        this.DGSrc = this.BigDataSrc;
        // нужно срезать BigDataSource по списку из кеша, т.е. то, что в корзине уже, не показывать в таблице        
        if (this.BasketSrc && this.BasketSrc.length) {
            this.DGSrc = this.DGSrc.filter((x: IHierarchyNodeLogicDevice) => {
                return this.BasketSrc.find((y: IHierarchyNodeLogicDevice) => y.Id === x.Id && y.IdUnit === x.IdUnit) == null;
            });
        }

        this.dataGrid.DataSource = this.DGSrc;
    }

    private loadDataForGrid(filterKey?: string): Observable<IHierarchyNodeLogicDevice[]> {

        return this.hierarchiesLogicDevicesEditorService
                    .getLogicDevices(filterKey);
    }

    private loadTable(filterKey?: string): Observable<boolean> {
        return new Observable(subscribe => {
            this.loadingDG = true;
            this.loadDataForGrid(filterKey)
                .pipe(
                    finalize(() => {
                        this.loadingDG = false;
                    })
                )
                .subscribe((tables: IHierarchyNodeLogicDevice[]) => {
                    this.BigDataSrc = tables;
                    this.loadTabData();

                    subscribe.next();
                    subscribe.complete();
                }, (error: any) => {
                    this.DGErrors = [error];
                    subscribe.error(error);
                });
        });
    }

    private loadBasket() {
        this.loadingBasket = true;
        this.hierarchiesEditorService
            .getLogicDevices(this.idNode)
            .pipe(
                finalize(() => {
                    this.loadingBasket = false;
                })
            )
            .subscribe((data: IHierarchyNodeLogicDevice[]) => {
                    if (data && data.length) {
                        this.BasketSrc = data;
                    }
                    this.loadTable().subscribe(() => {
                        this.pageInitComplete = true;
                    });
                },
                (error: any) => {
                    this.BasketErrors = [error];
                }
            );
    }

    private pageInit() {
        this.loadBasket();
    }
    /**
     * РАБОТА С КОРЗИНОЙ ==============================
     */
    public toObjectsPanel() {
        const selectedRows = this.dataGrid.getSelectDataRows().map((item: any) => {
            return { ...item };
        });
        this.convertJobObjects(selectedRows);

        this.loadTabData();
    }

    public clearAllBasket() {
        this.BasketSrc = [];

        this.loadTabData();
    }

    public clearItemsBasket(itemsBasket: IHierarchyNodeLogicDevice[]) {
        this.BasketSrc = this.BasketSrc.filter((x: IHierarchyNodeLogicDevice) => {
            return itemsBasket.find((y: IHierarchyNodeLogicDevice) => y.Id === x.Id && y.IdUnit === x.IdUnit) == null;
        });

        this.loadTabData();
    }

    private convertJobObjects(selectedRows: any[]) {
        const jobObjects = this.BasketSrc || [];
        const countInputItemsBasket = (selectedRows || []).length;
        if (countInputItemsBasket) {
            this.BasketSrc = jobObjects.concat(selectedRows);
        }
    }
    /**
     * РАБОТА С КОРЗИНОЙ ========= КОНЕЦ ===============
     */

    public onApplyFilter(guid: string): void {
        this.loadTable(guid).subscribe(() => {});
    }

    public Cancel() {
        GlobalValues.Instance.Page.backwardButton.navigate();
    }

    public Save() {

        this.loadingBasket = true;
        this.loadingDG = true;

        const esos: any[] = [];

        const ids = (this.BasketSrc || []).map(d => d.Id);
        this.hierarchiesEditorService
            .postLogicDevicesToNode(ids, this.idNode)
            .then((result: any) => {
                this.loadingBasket = false;
                this.loadingDG = false;
                GlobalValues.Instance.Page.backwardButton.navigate();
            })
            .catch((error: any) => {
                this.loadingBasket = false;
                this.loadingDG = false;
                this.BasketErrors = [error];
            });
    }

    @HostListener('document:keydown', ['$event']) onKeyDownFilter(event: KeyboardEvent) {
        if (event.ctrlKey) {
            // Ctrl + s = save
            if (event.keyCode === 83) {
                event.preventDefault();
                this.Save();
            }
        } else {
            if (event.keyCode === 27) {
                this.Cancel();
            }
        }
    }
}

class ObjectTableViewWithEso extends ObjectTableView {
    IdEso: number;
    EsoName: string;
}

class CachedDataGrid {
    rowsSelect: any[];
    rowsIndeterminate: any[];
}

class TreeNodeObjectDevice {
    Key: any;
    IsCheck: boolean;

    // св-ва Unit
    IsIndeterminate: boolean;
    Childs: TreeNodeObjectDevice[];
    // св-ва LD
    InBasket: boolean;
    Parent: TreeNodeObjectDevice;
}
