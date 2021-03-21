import { AppLocalization } from 'src/app/common/LocaleRes';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavigateItem } from 'src/app/common/models/Navigate/NavigateItem';
import { IDatabaseDataQueryTask } from 'src/app/services/data-query';
import {
  HierarchyPropertyService,
  IHierarchy,
} from 'src/app/services/additionally-hierarchies';
import { TariffMainTaskService } from 'src/app/services/taiff-calculation/export-import-queue/Task/TariffMainTask.service';

@Component({
  selector: 'rom-tariff-calculator-main-filter',
  templateUrl: './tariff-calculator-main-filter.component.html',
  styleUrls: ['./tariff-calculator-main-filter.component.less'],
})
export class TariffCalculatorMainFilterComponent implements OnInit, OnDestroy {
  public errorsContentValidationForms: any[] = [];
  public menuItems: NavigateItem[];
  filterId: number;
  filterTaskData: IDatabaseDataQueryTask;
  subscription$: Subscription;
  Hierarchy: IHierarchy;

  constructor(
    private activatedRoute: ActivatedRoute,
    private tariffMainTaskService: TariffMainTaskService,
    private hierarchyPropertyService: HierarchyPropertyService
  ) {
    this.filterId = this.activatedRoute.parent.snapshot.params.id;
    this.accessTabMenu();
  }

  ngOnInit() {
    this.subscription$ = this.tariffMainTaskService
      .getData(this.filterId)
      .subscribe(
        (data: IDatabaseDataQueryTask) => {
          this.saveToCache(data);
          this.filterTaskData = data;
          const hierarchyId = (data as any).HierarchyId;
          if (hierarchyId) {
            this.hierarchyPropertyService
              .getHierarchy(hierarchyId)
              .subscribe((hierarchy) => (this.Hierarchy = hierarchy));
          }
        },
        (error) => {
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
        code: 'parameters',
        url: 'parameters',
        name: AppLocalization.Options,
      },
      {
        code: 'log',
        url: 'log',
        name: AppLocalization.Log,
        access: 'TC_VIEW_LOG'
      },
    ];
  }

  private saveToCache(data: IDatabaseDataQueryTask) {
    const dataPrefix = 'task-data-';
    this.tariffMainTaskService.setCache(dataPrefix + this.filterId, data);
  }
}
