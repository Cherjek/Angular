import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigateItem } from 'src/app/common/models/Navigate/NavigateItem';
import { RequestResultService } from 'src/app/services/requests.module/Result/request-result.service';
import { IDatabaseDataQueryTask } from 'src/app/services/data-query';
import { HierarchyPropertyService, IHierarchy } from 'src/app/services/additionally-hierarchies';

@Component({
  selector: 'rom-request-result',
  templateUrl: './request-result.component.html',
  styleUrls: ['./request-result.component.css'],
  providers: [RequestResultService, HierarchyPropertyService]
})
export class RequestResultComponent implements OnInit, OnDestroy {
  public errorsContentValidationForms: any[] = [];
  public menuItems: NavigateItem[];
  deviceTypeId: number;
  logicDeviceData: IDatabaseDataQueryTask;
  subscription$: any;
  Hierarchy: IHierarchy;

  constructor(
    private activatedRoute: ActivatedRoute,
    private reqResultService: RequestResultService,
    private hierarchyPropertyService: HierarchyPropertyService,
    private router: Router
  ) {
    this.deviceTypeId = this.activatedRoute.parent.snapshot.params.id;
    this.accessTabMenu();
  }

  get hideHeader() {
    return this.router.url.includes('steps');
  }

  ngOnInit() {
    this.subscription$ = this.reqResultService
      .getData(this.deviceTypeId)
      .subscribe(
        (data: IDatabaseDataQueryTask) => {
          this.saveToCache(data);
          this.logicDeviceData = data;

          if (data.IdHierarchy) {
              this.hierarchyPropertyService
                .getHierarchy(data.IdHierarchy)
                .subscribe(hierarchy => this.Hierarchy = hierarchy)
          }
        },
        error => {
          this.errorsContentValidationForms.push(error);
        }
      );
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }

  private accessTabMenu() {
    this.menuItems = [
      {
        code: 'log',
        url: 'log',
        name: AppLocalization.Log,
        access: 'DQ_VIEW_LOG'
      },
      {
        code: 'logic-devices',
        url: 'logic-devices',
        name: AppLocalization.Label32
      },
      {
        code: 'parameters',
        url: 'parameters',
        name: AppLocalization.Options
      },
      {
        code: 'steps',
        url: 'steps',
        name: AppLocalization.Stages,
        access: 'DQ_VIEW_STEPS'
      }
    ];
  }

  /**
   *
   * @param data полученных данных от бэкэнда
   * Метод для кэширования данных бэкэнда
   */
  private saveToCache(data: IDatabaseDataQueryTask) {
    const dataPrefix = 'task-data-';
    this.reqResultService.setCache(dataPrefix + this.deviceTypeId, data);
  }
}
