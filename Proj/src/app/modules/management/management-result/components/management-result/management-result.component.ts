import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigateItem } from 'src/app/common/models/Navigate/NavigateItem';
import { IDatabaseDataQueryTask } from 'src/app/services/data-query';
import { HierarchyPropertyService, IHierarchy } from 'src/app/services/additionally-hierarchies';
import { ManagementResultService } from 'src/app/services/managements.module/Result/management-result.service';
import { IManagementParams } from 'src/app/services/managements.module/Models/management-params';

@Component({
  selector: 'rom-management-result',
  templateUrl: './management-result.component.html',
  styleUrls: ['./management-result.component.less'],
  providers: [ManagementResultService, HierarchyPropertyService]
})
export class ManagementResultComponent implements OnInit, OnDestroy {
  public errorsContentValidationForms: any[] = [];
  public menuItems: NavigateItem[];
  deviceTypeId: number;
  managementData: IManagementParams;
  subscription$: any;
  Hierarchy: IHierarchy;

  constructor(
    private activatedRoute: ActivatedRoute,
    private manageParamsService: ManagementResultService,
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
    this.subscription$ = this.manageParamsService
      .getData(this.deviceTypeId)
      .subscribe(
        (data: IManagementParams) => {
          this.saveToCache(data);
          this.managementData = data;

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
        access: 'CMD_VIEW_LOG'
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
        access: 'CMD_VIEW_STEPS'
      }
    ];
  }

  /**
   *
   * @param data полученных данных от бэкэнда
   * Метод для кэширования данных бэкэнда
   */
  private saveToCache(data: IManagementParams) {
    this.manageParamsService.setCache(this.deviceTypeId, data);
  }
}
