import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { HierarchyMainService } from 'src/app/services/hierarchy-main';
import {
  IHierarchy,
  Hierarchy,
  IHierarchyNodeView,
} from 'src/app/services/additionally-hierarchies';
import { finalize, delay } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { ScheduleHierarchyService } from 'src/app/services/schedules.module';
import { ActivatedRoute } from '@angular/router';
import {
  DataGrid,
  SelectionRowMode as DGSelectionRowMode,
} from 'src/app/controls/DataGrid';
import { HierarchyFilterContainerService } from 'src/app/services/schedules.module/filters-schedule-hierarchy/HierarchyFilterContainer.service';
import { GlobalValues } from 'src/app/core';
import { NotificationSettingsService } from 'src/app/services/notifications/notification-settings.service';
import { INotificationHierarchySchedule } from 'src/app/services/commands/Models/NotificationHierarchySchedule';

@Component({
  selector: 'rom-notifications-hierarchies-edit',
  templateUrl: './notifications-hierarchies-edit.component.html',
  styleUrls: ['./notifications-hierarchies-edit.component.less'],
})
export class NotificationsHierarchiesEditComponent implements OnInit {
  public changeDetection: string;
  public loadingContentPanel = false;
  public loadingBasket: boolean;
  public errorsContentForm: any[] = [];
  public errorsBasketForm: any[] = [];
  public changeHierarchyComplete = false;
  public hierarchyEmpty = false;
  public hierarchies: IHierarchy[];
  public hierarchySelect: IHierarchy;
  public filterKey: string;
  public basketItems: IHierarchyNodeView[];
  public notificationsHierarchyNodesCache: INotificationHierarchySchedule;

  DGSelectionRowMode = DGSelectionRowMode;
  @ViewChild('Ro5DataGrid', { static: false }) public dataGrid: DataGrid;

  private bigDataSource: IHierarchyNodeView[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private notificationSettingsService: NotificationSettingsService,
    public scheduleHierarchyService: ScheduleHierarchyService,
    public hierarchyFilterContainerService: HierarchyFilterContainerService,
    public hierarchyMainService: HierarchyMainService
  ) {}

  ngOnInit() {
    this.notificationSettingsService.notificationId = this.activatedRoute.snapshot.params.id;

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

  private loadScheduleHierarchiesWithCache() {
    if (this.notificationsHierarchyNodesCache != null) {
      return of(this.notificationsHierarchyNodesCache);
    } else {
      return this.notificationSettingsService.getHierarchiesSchedule();
    }
  }

  private loadScheduleHierarchies() {
    this.loadingContentPanel = true;
    this.loadScheduleHierarchiesWithCache()
      .pipe(finalize(() => (this.loadingContentPanel = false)))
      .subscribe(
        (data: INotificationHierarchySchedule) => {
          if (data) {
            this.notificationsHierarchyNodesCache = data;

            this.basketItems = data.Nodes;

            const hierarchySelect = new Hierarchy();
            hierarchySelect.Id = data.Hierarchy.Id;
            hierarchySelect.Name = data.Hierarchy.Name;
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
            this.hierarchyEmpty = true;
          }
        },
        (error) => {
          if (error && error.ShortMessage && (error.ShortMessage as string).toLowerCase().startsWith('permission denied')) {
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

    this.scheduleHierarchyService
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
        Name: 'DisplayName',
      },
    ];

    let dgSrc = this.bigDataSource;
    // нужно срезать BigDataSource по списку из кеша, т.е. то, что в корзине уже, не показывать в таблице
    if (this.basketItems && this.basketItems.length) {
      dgSrc = dgSrc.filter((x: IHierarchyNodeView) => {
        return (
          this.basketItems.find(
            (y: IHierarchyNodeView) => y.Id === x.Id && y.Id === x.Id
          ) == null
        );
      });
    }

    this.dataGrid.DataSource = dgSrc;
  }

  /**
   * РАБОТА С КОРЗИНОЙ ==============================
   */
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
    this.loadingContentPanel = true;
    this.loadingBasket = true;

    const request: INotificationHierarchySchedule = {} as INotificationHierarchySchedule;
    request.Hierarchy = {
      Id: this.hierarchySelect.Id,
      Name: '',
      Code: '',
    };
    request.Nodes = this.basketItems;

    this.notificationSettingsService
      .postHierarchiesSchedule(request)
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
