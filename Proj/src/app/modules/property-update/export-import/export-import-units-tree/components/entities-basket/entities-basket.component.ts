import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { finalize, delay } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { DataGrid, SelectionRowMode as DGSelectionRowMode } from 'src/app/controls/DataGrid';
import { HierarchyFilterContainerService } from 'src/app/services/property-update/filters-entities/filters-nodes/HierarchyFilterContainer.service';
import { HierarchyDefFiltersService } from 'src/app/services/property-update/filters-entities/filters-nodes/HierarchyDefFilters.service';
import { HierarchyAddFiltersService } from 'src/app/services/property-update/filters-entities/filters-nodes/HierarchyAddFilters.service';
import { GlobalValues } from 'src/app/core';
import { DevicesFilterContainerService } from 'src/app/services/property-update/filters-entities/filter-devices/DevicesFilterContainer.service';
import { DevicesAddFiltersService } from 'src/app/services/property-update/filters-entities/filter-devices/DevicesAddFilters.service';
import { DevicesDefFiltersService } from 'src/app/services/property-update/filters-entities/filter-devices/DevicesDefFilters.service';
import { DataObjectsService } from 'src/app/services/objects.module/DataObjects.service';
import { FilterObjectsContainerService } from 'src/app/services/objects.module/Filters/FilterContainer.service';
import { keyUnits } from '../../../export-import-create/components/property-update-export-import-create/property-update-export-import-create.component';

type FormDataRow = { Id: number, DisplayName: string; };

@Component({
    selector: 'rom-entities-basket',
    templateUrl: './entities-basket.component.html',
    styleUrls: ['./entities-basket.component.less'],
    providers: [HierarchyFilterContainerService, HierarchyDefFiltersService, HierarchyAddFiltersService,
      DevicesFilterContainerService, DevicesAddFiltersService, DevicesDefFiltersService]
})
export class EntitiesBasketComponent implements OnInit {

    public changeDetection: string;
    public loadingContentPanel = false;
    public loadingBasket: boolean;
    public errorsContentForm: any[] = [];
    public errorsBasketForm: any[] = [];
    public filterKey: string;
    public basketItems: FormDataRow[];
    public entityType: string;
    public hierarchyId: number;
    public containerService: any;
    public header: string;

    DGSelectionRowMode = DGSelectionRowMode;
    @ViewChild('Ro5DataGrid', { static: false }) public dataGrid: DataGrid;

    private bigDataSource: FormDataRow[];

    private get unitsTreeStorage() {
      let units = sessionStorage.getItem(keyUnits);
      if (units != null) return JSON.parse(units);
      return undefined;
    }

    constructor(
        private activeRoute: ActivatedRoute,
        public hierarchyDefFiltersService: HierarchyDefFiltersService,
        public hierarchyFilterContainerService: HierarchyFilterContainerService,
        public devicesDefFiltersService: DevicesDefFiltersService,
        public devicesFilterContainerService: DevicesFilterContainerService,
        
        public dataSource: DataObjectsService,
        public filterContainerService: FilterObjectsContainerService) { 
          this.entityType = this.activeRoute.snapshot.params.entityType;
          this.hierarchyId = this.activeRoute.snapshot.queryParams.idHierarchy;
          hierarchyFilterContainerService.updateIdHierarchy(this.hierarchyId);

          this.containerService = 
            this.entityType === 'Devices' ? devicesFilterContainerService :
              this.entityType === 'LogicDevices' || this.entityType === 'Objects' ? filterContainerService :
              hierarchyFilterContainerService;
          this.header = this.entityType === 'Devices' ? AppLocalization.Label110 :
            this.entityType === 'LogicDevices' ? AppLocalization.Label32 :
            this.entityType === 'Objects' ? AppLocalization.Objects :
            AppLocalization.HierarchyNodes;
    }

    ngOnInit() {
        this.loadData();
    }

    @HostListener('document:keydown', ['$event']) onKeyDownFilter(event: KeyboardEvent) {
        if (event.ctrlKey) {
            // Ctrl + s = save
            if (event.keyCode === 83) {
                event.preventDefault();
                this.save();
            }
        } else {
            if (event.keyCode === 27) {
                this.cancel();
            }
        }
    }    

    private loadData() {

        this.loadingContentPanel = true;

        let obs: Observable<any>;
        if (this.entityType === 'Devices') {
          obs = this.devicesDefFiltersService.getDevices(this.filterKey);
        } else if (this.entityType === 'LogicDevices' || this.entityType === 'Objects') {
          obs = this.dataSource.get(this.filterKey);
        } else {
          obs = this.hierarchyDefFiltersService.getNodes(this.hierarchyId, this.filterKey);
        }
        obs.pipe(
                finalize(() => this.loadingContentPanel = false)
            )
            .subscribe(
                (data: FormDataRow[]) => {
                    this.bigDataSource = data;
                    this.loadTabData(true);
                },
                (error) => {
                    this.errorsContentForm.push(error);
                }
            );

    }

    private loadTabData(firstLoad?: boolean) {
        this.dataGrid.initDataGrid();
        this.dataGrid.Columns = [{
            Name: 'DisplayName'
        }];

        let dgSrc = this.bigDataSource;
        
        if (this.entityType === 'LogicDevices') {
          dgSrc = dgSrc.filter((x: any) => x.IdLogicDevice != null);
          dgSrc.forEach(x => {
            x['DisplayName'] = `${x['LogicDeviceDisplayText']}`;
            x.Id = x['IdLogicDevice'];
          });
        } else if (this.entityType === 'Objects') {
          let result: any[] = [];
          let groupUnitIdContains = {};
          dgSrc.forEach((unit: any) => {
            if (!groupUnitIdContains[unit.IdUnit]) {
              groupUnitIdContains[unit.IdUnit] = 1;
              result.push(unit);
            }
          });
          dgSrc = result;
          dgSrc.forEach(x => {
            x['DisplayName'] = `${x['UnitDisplayText']}`;
            x.Id = x['IdUnit'];
          });
        }

        // session storage
        if (firstLoad && this.unitsTreeStorage != null && this.unitsTreeStorage[this.entityType] != null) {
          this.basketItems = dgSrc.filter(d => (this.unitsTreeStorage[this.entityType] as Array<any>).find(ss => ss.Id === d.Id) != null);
        }

        // нужно срезать BigDataSource по списку из кеша, т.е. то, что в корзине уже, не показывать в таблице        
        if (this.basketItems && this.basketItems.length) {
          dgSrc = dgSrc.filter((x: FormDataRow) => {
              return this.basketItems.find((y: FormDataRow) => y.Id === x.Id && y.Id === x.Id) == null;
          });
        }

        this.dataGrid.DataSource = dgSrc;
    }

    /**
     * РАБОТА С КОРЗИНОЙ ==============================
     */
    public toObjectsPanel() {
        const selectedRows = this.dataGrid.getSelectDataRows().map((item: FormDataRow) => {
            return { ...item };
        });
        this.convertJobObjects(selectedRows);

        this.loadTabData();
    }

    public clearAllBasket() {
        this.basketItems = [];

        this.loadTabData();
    }

    public clearItemsBasket(itemsBasket: FormDataRow[]) {
        this.basketItems = this.basketItems.filter((x: FormDataRow) => {
            return itemsBasket.find((y: FormDataRow) => y.Id === x.Id && y.Id === x.Id) == null;
        });

        this.loadTabData();
    }

    private convertJobObjects(selectedRows: FormDataRow[]) {
        const jobObjects = this.basketItems || [];
        const countInputItemsBasket = (selectedRows || []).length;
        if (countInputItemsBasket) {
            this.basketItems = jobObjects.concat(selectedRows);
        }
    }
    /**
     * РАБОТА С КОРЗИНОЙ ========= КОНЕЦ ===============
     */

    public onApplyFilter(guid: string): void {
        this.filterKey = guid;
        this.loadData();
    }

    public cancel() {
      GlobalValues.Instance.Page.backwardButton.navigate();
    }

    public save() {
      const result = {};
      result[this.entityType] = this.basketItems;
      GlobalValues.Instance.Page = {
        ComponentItems: result
      }
      GlobalValues.Instance.Page.backwardButton.navigate();        
    }
}
