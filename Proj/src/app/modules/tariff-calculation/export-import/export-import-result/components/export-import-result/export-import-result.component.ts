import { AppLocalization } from 'src/app/common/LocaleRes';
import { ImportExportTask } from './../../../../../../services/taiff-calculation/export-import-queue/Models/ImportExportTask';
import { ExportImportService } from 'src/app/services/taiff-calculation/export-import-queue/export-import.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigateItem } from 'src/app/common/models/Navigate/NavigateItem';
import {
  HierarchyPropertyService,
  IHierarchy,
} from 'src/app/services/additionally-hierarchies';

@Component({
  selector: 'rom-export-import-result',
  templateUrl: './export-import-result.component.html',
  styleUrls: ['./export-import-result.component.less'],
})
export class ExportImportResultComponent implements OnInit, OnDestroy {
  public errorsContentValidationForms: any[] = [];
  public menuItems: NavigateItem[];
  deviceTypeId: number;
  taskData: ImportExportTask;
  subscription$: any;
  Hierarchy: IHierarchy;

  constructor(
    private activatedRoute: ActivatedRoute,
    private exportImportService: ExportImportService,
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
    this.subscription$ = this.exportImportService
      .getTask(this.deviceTypeId)
      .subscribe(
        (data: ImportExportTask) => {
          this.taskData = data;

          if (data.HierarchyId) {
            this.hierarchyPropertyService
              .getHierarchy(data.HierarchyId)
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
        access: 'TC_EXPORT_IMPORT_VIEW_LOG'
      },
    ];
  }
}
