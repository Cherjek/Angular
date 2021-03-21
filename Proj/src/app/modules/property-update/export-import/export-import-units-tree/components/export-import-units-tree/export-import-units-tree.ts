import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  HostListener,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { forkJoin, Subscription } from 'rxjs/index';
import { GlobalValues, Utils } from '../../../../../../core';
import {
  TreeListItem,
  TreeListCheckedPanelComponent,
} from '../../../../../../shared/rom-forms/treeList.checked.panel';
import { PropertyUpdateEntityTypesService } from 'src/app/services/property-update/entity/property-update-entity-types.service';
import { ObjectViewNode } from 'src/app/services/property-update/Models/ObjectViewNode';
import { keyUnits } from '../../../export-import-create/components/property-update-export-import-create/property-update-export-import-create.component';
import { AppLocalization } from 'src/app/common/LocaleRes';

export interface FilterData {
  name: string;//'Объект' | 'Тип' | 'Значения';
  key: 'units' | 'type' | 'values';
}

@Component({
  selector: 'admin-group-geo-edit',
  templateUrl: './export-import-units-tree.html',
  styleUrls: ['./export-import-units-tree.less'],
  providers: [PropertyUpdateEntityTypesService, Utils.UtilsTree],
})
export class UnitsTreeComponent implements OnInit, OnDestroy {
  public errors: any[] = [];
  public loadingContentPanel: boolean;
  public subscribe: Subscription;
  public entityCode: string;
  public changeDetection: string;

  // TreeListChecked
  public unitsTree: ObjectViewNode[];
  public treeListItems: TreeListItem[];

  // Basket
  public unitsBasketTree: ObjectViewNode[];
  //public geoPermissionsDataGrid: GeoPermissions[];
  public checkedUnitsBasketTree: any[];

  public filterData: FilterData[] = [
    { name: AppLocalization.Object, key: 'units' },
    { name: AppLocalization.Type, key: 'type' },
    { name: AppLocalization.Value, key: 'values' }
  ];
  public filterBy: FilterData = this.filterData[0];
  public filterQuery: string;
  public dataGridFilterQuery: string;

  @ViewChild('treelistCheckedPanel', { static: false })
  treelistCheckedPanel: TreeListCheckedPanelComponent;

  private get unitsTreeStorage() {
    let units = sessionStorage.getItem(keyUnits);
    if (units != null) return JSON.parse(units);
    return undefined;
  }

  constructor(
    public unitsService: PropertyUpdateEntityTypesService,
    public activatedRoute: ActivatedRoute,
    public router: Router,
    public utilsTree: Utils.UtilsTree
  ) {
    
  }

  ngOnInit() {
    this.initTreeList();
    this.loadData();
  }

  ngOnDestroy(): void {
    this.subscribe.unsubscribe();
  }

  @HostListener('document:keydown', ['$event']) onKeyDownFilter(
    event: KeyboardEvent
  ) {
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

  public initTreeList() {
    let treeListItems: TreeListItem[] = [];
    this.filterData.forEach((element) => {
      treeListItems.push(new TreeListItem(element.name));
    });
    this.treeListItems = treeListItems;
  }

  private loadData(): void {
    this.loadingContentPanel = true;
    this.subscribe = this.unitsService
      .getObjectViewNodes().subscribe(
      (tree) => {
        
        if (this.unitsTreeStorage != null) {
          this.unitsBasketTree = this.unitsTreeStorage;
        }
        this.utilsTree.excludeTree(
          this.unitsBasketTree,
          tree,
          'Id',
          'Nodes'
        );
        this.unitsTree = tree;        
        this.loadingContentPanel = false;
      },
      (error) => {
        this.loadingContentPanel = false;
      }
    );
  }

  /**
   * Получает массив выбранных ESO Ids, парсит в дерево
   * @param selectedRowsIds number[]
   */
  public onBasketMove(selectedRowsIds: number[]): void {
    this.dataGridFilterQuery = null;

    if (!selectedRowsIds || selectedRowsIds.length === 0) {
      return;
    }
    let treeFilters: ObjectViewNode[] = this.utilsTree.filterSourceTreeFromIds(
      selectedRowsIds,
      this.unitsTree,
      'Id',
      'Nodes'
    );

    this.onBasketItemAdd(treeFilters);
  }

  onBasketItemAdd(items?: ObjectViewNode[]) {
    if (items == null && this.treelistCheckedPanel) {
      items = this.treelistCheckedPanel.getDataChecked<ObjectViewNode>();
    }

    let unitsTree = [...this.unitsTree];
    let unitsBasketTree = [...(this.unitsBasketTree || [])];
    this.utilsTree.includeTree(items, unitsBasketTree, 'Id', 'Nodes');
    this.utilsTree.excludeTree(items, unitsTree, 'Id', 'Nodes');
    setTimeout(() => {
      this.unitsTree = unitsTree;
      this.unitsBasketTree = unitsBasketTree;

      this.changeDetection = new Date().getTime().toString();
    });
  }

  onBasketItemRemove() {
    let filters = this.checkedUnitsBasketTree.map((node) => node['Id']);
    let treeFilters = this.utilsTree.filterSourceTreeFromIds(
      filters,
      this.unitsBasketTree,
      'Id',
      'Nodes'
    );
    let unitsTree = [...this.unitsTree];
    let unitsBasketTree = [...this.unitsBasketTree];
    this.utilsTree.includeTree(treeFilters, unitsTree, 'Id', 'Nodes');
    this.utilsTree.excludeTree(treeFilters, unitsBasketTree, 'Id', 'Nodes');

    setTimeout(() => {
      this.unitsTree = unitsTree;
      this.unitsBasketTree = unitsBasketTree;

      this.changeDetection = new Date().getTime().toString();
    });
  }

  save() {
    GlobalValues.Instance.Page = {
      UnitsTreeComponentNodes: this.unitsBasketTree
    }
    GlobalValues.Instance.Page.backwardButton.navigate();
  }

  cancel() {
    this.goBack();
  }

  goBack() {
    GlobalValues.Instance.Page.backwardButton.navigate();
  }
}
