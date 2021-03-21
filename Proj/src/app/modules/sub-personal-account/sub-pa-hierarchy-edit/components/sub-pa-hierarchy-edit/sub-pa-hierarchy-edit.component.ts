import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { HierarchyMainService } from 'src/app/services/hierarchy-main';
import {
  IHierarchy,
  Hierarchy,
  IHierarchyNodeView,
} from 'src/app/services/additionally-hierarchies';
import { finalize, delay } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import {
  DataGrid,
  SelectionRowMode as DGSelectionRowMode,
} from 'src/app/controls/DataGrid';
import { HierarchyFilterContainerService } from 'src/app/services/schedules.module/filters-schedule-hierarchy/HierarchyFilterContainer.service';
import { GlobalValues } from 'src/app/core/global-values';
import { PaSubscriberCardService } from 'src/app/services/sub-personal-account/pa-subscriber-card.service';
import { CustomerNodes } from 'src/app/services/sub-personal-account/models/CustomerNodes';
import { ISubPersonalAccount } from 'src/app/services/sub-personal-account/models/SubPersonalAccount';
import { PaSubscriberHierarchyService } from 'src/app/services/sub-personal-account/pa-subscriber-hierarchy.service';
import { SubPersonalAccountService } from 'src/app/services/sub-personal-account/sub-personal-account-main.service';
import { AppLocalization } from 'src/app/common/LocaleRes';

@Component({
  selector: 'rom-sub-pa-hierarchy-edit',
  templateUrl: './sub-pa-hierarchy-edit.component.html',
  styleUrls: ['./sub-pa-hierarchy-edit.component.less'],
  providers: [HierarchyFilterContainerService, HierarchyMainService],
})
export class SubPaHierarchyEditComponent implements OnInit {
  public changeDetection: string;
  public loadingContentPanel = false;
  public loadingBasket: boolean;
  public errorsContentForm: any[] = [];
  public errorsBasketForm: any[] = [];
  public changeHierarchyComplete = false;
  public hierarchyEmty = false;
  public hierarchies: IHierarchy[];
  public hierarchySelect: IHierarchy;
  public filterKey: string;
  public basketItems: IHierarchyNodeView[];
  public customerId: number;
  public scheduleHierarchyNodesCache: [CustomerNodes[], ISubPersonalAccount];

  DGSelectionRowMode = DGSelectionRowMode;
  @ViewChild('Ro5DataGrid', { static: false }) public dataGrid: DataGrid;

  private bigDataSource: IHierarchyNodeView[];
  application: ISubPersonalAccount;
  hierarchyNodeIds: CustomerNodes[];

  constructor(
    private activeRoute: ActivatedRoute,
    private paSubscriberCardService: PaSubscriberCardService,
    public paSubscriberHierarchyService: PaSubscriberHierarchyService,
    public hierarchyFilterContainerService: HierarchyFilterContainerService,
    public personalAccountService: SubPersonalAccountService,
    public hierarchyMainService: HierarchyMainService
  ) {}

  ngOnInit() {
    this.customerId = this.activeRoute.snapshot.params.id;

    this.loadScheduleHierarchies();
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

  private loadScheduleHierarchiesWithCache(): Observable<
    [CustomerNodes[], ISubPersonalAccount]
  > {
    if (this.scheduleHierarchyNodesCache != null) {
      return of(this.scheduleHierarchyNodesCache);
    } else {
      return this.paSubscriberCardService.getAppsAndNodes(this.customerId);
    }
  }

  private loadScheduleHierarchies() {
    this.loadingContentPanel = true;
    this.loadScheduleHierarchiesWithCache()
      .pipe(finalize(() => (this.loadingContentPanel = false)))
      .subscribe(
        (data) => {
          if (data) {
            this.scheduleHierarchyNodesCache = data;

            this.basketItems = (data[0] as any) as IHierarchyNodeView[];
            this.application = data[1];
            this.hierarchyNodeIds = data[0];

            const hierarchySelect = new Hierarchy();
            hierarchySelect.Id = data[1].Hierarchy.Id;
            hierarchySelect.Name = data[1].Hierarchy.Name;
            this.hierarchySelect = hierarchySelect;
          }

          this.loadHierarchies();
        },
        (error) => {
          this.errorsContentForm.push(error);
        }
      );
  }

  private loadHierarchies() {
    this.loadingContentPanel = true;

    this.hierarchyMainService
      .getHierarchies()
      .pipe(
        finalize(() => {
          this.loadingContentPanel = false;
        })
      )
      .subscribe(
        (data: IHierarchy[]) => {
          this.hierarchies = data;
          if (data.length) {
            if (this.hierarchySelect == null) {
              this.hierarchySelect = data[0];
            }

            this.changeHierarchy();
          } else {
            this.hierarchyEmty = true;
          }
        },
        (error) => {
          if (
            error &&
            error.ShortMessage &&
            (error.ShortMessage as string)
              .toLowerCase()
              .startsWith('permission denied')
          ) {
            error.ShortMessage = AppLocalization.Label17;
          }
          this.errorsContentForm = [error];
          this.changeHierarchyComplete = true;
        }
      );
  }

  public changeHierarchy() {
    this.changeHierarchyComplete = false;

    const observ = new Observable((subscribe) => {
      subscribe.next();
      subscribe.complete();
    });
    observ
      .pipe(
        delay(1000),
        finalize(() => {
          this.hierarchyFilterContainerService.updateIdHierarchy(
            this.hierarchySelect.Id
          );

          this.changeHierarchyComplete = true;
          this.filterKey = null;
          this.loadData();
        })
      )
      .subscribe();
  }

  private loadData() {
    this.loadingContentPanel = true;

    this.paSubscriberHierarchyService
      .getNodes(this.hierarchySelect.Id, this.filterKey)
      .pipe(finalize(() => (this.loadingContentPanel = false)))
      .subscribe(
        (data: IHierarchyNodeView[]) => {
          this.bigDataSource = data;
          this.loadTabData();
        },
        (error) => {
          this.errorsContentForm.push(error);
        }
      );
  }

  private loadTabData() {
    this.dataGrid.initDataGrid();
    this.dataGrid.Columns = [
      {
        Name: 'Name',
      },
    ];

    let source = this.bigDataSource;
    if (this.basketItems && this.basketItems.length) {
      source = source.filter((x: IHierarchyNodeView) => {
        return (
          this.basketItems.find(
            (y: IHierarchyNodeView) => y.Id === x.Id && y.Id === x.Id
          ) == null
        );
      });
    }

    this.dataGrid.DataSource = source;
  }

  public toObjectsPanel() {
    const selectedRows = this.dataGrid
      .getSelectDataRows()
      .map((item: IHierarchyNodeView) => {
        return { ...item };
      });
    this.convertJobObjects(selectedRows);

    this.loadTabData();
  }

  public clearAllBasket() {
    this.basketItems = [];

    this.loadTabData();
  }

  public clearItemsBasket(itemsBasket: IHierarchyNodeView[]) {
    this.basketItems = this.basketItems.filter((x: IHierarchyNodeView) => {
      return (
        itemsBasket.find(
          (y: IHierarchyNodeView) => y.Id === x.Id && y.Id === x.Id
        ) == null
      );
    });

    this.loadTabData();
  }

  private convertJobObjects(selectedRows: IHierarchyNodeView[]) {
    const jobObjects = this.basketItems || [];
    const countInputItemsBasket = (selectedRows || []).length;
    if (countInputItemsBasket) {
      this.basketItems = jobObjects.concat(selectedRows);
    }
  }

  public onApplyFilter(guid: string): void {
    this.filterKey = guid;
    this.loadData();
  }

  public cancel() {
    GlobalValues.Instance.Page.backwardButton.navigate();
  }

  public save() {
    this.loadingContentPanel = true;
    this.loadingBasket = true;
    this.hierarchyNodeIds = (this.basketItems || []).map((x) => x.Id) as any;

    this.paSubscriberCardService
      .postHierarchyNodes(this.hierarchyNodeIds, this.customerId)
      .then(() => {
        this.loadingBasket = false;
        this.loadingBasket = false;
        GlobalValues.Instance.Page.backwardButton.navigate();
      })
      .catch((error: any) => {
        this.loadingBasket = false;
        this.loadingContentPanel = false;
        this.errorsBasketForm = [error];
      });
  }
}
