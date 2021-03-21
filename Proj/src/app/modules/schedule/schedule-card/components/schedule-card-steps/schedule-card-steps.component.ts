import { AppLocalization } from 'src/app/common/LocaleRes';
import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  OnDestroy
} from '@angular/core';
import {
  DataGrid,
  ActionButtons,
  ActionButtonConfirmSettings
} from 'src/app/controls/DataGrid';
import { finalize, map } from 'rxjs/operators';

import { ActivatedRoute, Router } from '@angular/router';
import {
  ScheduleStep,
  ScheduleStepService,
  IScheduleStep,
  ScheduleStepType
} from 'src/app/services/schedules.module';
import { Subscription, Observable, forkJoin } from 'rxjs';
import { PermissionCheck } from 'src/app/core';

@Component({
  selector: 'rom-schedule-card-steps',
  templateUrl: './schedule-card-steps.component.html',
  styleUrls: ['./schedule-card-steps.component.css']
})
export class ScheduleCardStepsComponent implements OnInit, OnDestroy {
  public loadingContent: boolean;
  public errors: any[] = [];
  public scheduleSteps: IScheduleStep[];
  private scheduleId: number;

  @ViewChild('Ro5DataGrid', { static: true }) public dataGrid: DataGrid;
  @ViewChild('typeNameColumnTemplate', { static: true })
  private typeNameColumnTemplate: TemplateRef<any>;

  constructor(
    private permissionCheck: PermissionCheck,
    private scheduleStepsService: ScheduleStepService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    
  }

  ngOnInit() {
    this.scheduleId = this.activatedRoute.parent.snapshot.params.id;

    this.loadData();
  }

  ngOnDestroy() {
  }

  addNewStep() {
    this.router.navigate([`schedule-module/steps/${this.scheduleId}`]);
  }

  navigateToStep(step: IScheduleStep) {
    const url = step.StepType.Id === 1 ? 'step-requests' :
    step.StepType.Id === 3 ? 'step-reports' :
    step.StepType.Id === 2 ? 'step-manage' : '';
    
    this.router.navigate(['../../schedule-module/schedule/' + step.IdSchedule + `/${url}/` + step.Id + '/step/' + step.StepType.Id]);
  }

  private loadData() {
    this.loadingContent = true;
    this.scheduleStepsService
      .getSteps(this.scheduleId)
      .pipe(
         finalize(() => (this.loadingContent = false)))
      .subscribe(
        (scheduleSteps: IScheduleStep[]) => {
            scheduleSteps.map(s => (s as IScheduleStep).StepTypeName = (s as IScheduleStep).StepType.Name);
            this.scheduleSteps = scheduleSteps;
            this.initDG();
        },
        error => {
          this.errors = [error];
        }
      );
  }

  private initDG() {
    this.dataGrid.initDataGrid();
    this.dataGrid.KeyField = 'Id';

    this.dataGrid.Columns = [
      {
        Name: 'Name',
        Caption: AppLocalization.StepName,
        CellTemplate: this.typeNameColumnTemplate,
        disableTextWrap: true
      },
      {
        Name: 'StepTypeName',
        Caption: AppLocalization.StepType
      }
    ];

    this.dataGrid.DataSource = this.scheduleSteps;
    this.initActionButtons();
  }

  private accessDataGridInit(): Observable<boolean[]> {

    const checkAccess = [
        'SDL_STEP_DELETE',
        'SDL_STEPS_ARRANGE'
    ];

    const obsrvs: any[] = [];
    checkAccess.forEach((access: string | string[]) => {
        obsrvs.push(this.permissionCheck.checkAuthorization(access));
    });

    return forkJoin<boolean>(obsrvs);
  }

  private initActionButtons() {
    this.dataGrid.ActionButtons = [];
    this.accessDataGridInit().subscribe(result => {
      if (result[1]) {
        this.dataGrid.ActionButtons.push(new ActionButtons('ItemUp', AppLocalization.MoveUp + ' &uarr;'));
        this.dataGrid.ActionButtons.push(new ActionButtons('ItemDown', AppLocalization.MoveDown + ' &darr;'));
      }
      if (result[0]) {
        this.dataGrid.ActionButtons.push(
            new ActionButtons(
                'Delete',
                AppLocalization.Delete,
                new ActionButtonConfirmSettings(
                AppLocalization.DeleteRecordAlert,
                AppLocalization.Delete
                )
            )
        );
      }
    });
  }

  public onActionButtonClicked(event: any) {
    const step = event.item as ScheduleStep;
    switch (event.action) {
      case 'Edit':
        break;
      case 'Properties':
        break;
      case 'Delete':
        this.removeStep(step.Id);
        break;
      case 'ItemUp':
        this.moveStep(step, -1);
        break;
      case 'ItemDown':
        this.moveStep(step, 1);
        break;
    }
  }

  private removeStep(id: number) {
    this.loadingContent = true;
    this.scheduleStepsService
      .deleteStep(this.scheduleId, id)
      .then(() => {
        this.loadData(); // ререндерим заново строки с бэкенда
      })
      .catch((error: any) => {
        this.loadingContent = false;
        this.errors = [error];
      });
  }

  private moveStep(ldView: ScheduleStep, index: number) {
    const ids = this.scheduleSteps.map(x => x.Id);
    const x = ids.findIndex(x => x === ldView.Id);
    const y = x + index;
    if (y >= 0 && y < ids.length) {
      [ids[x], ids[y]] = [ids[y], ids[x]];

      this.updateSort(ids);
    }
  }

  private updateSort(ids: number[]) {
    this.loadingContent = true;
    this.scheduleStepsService
      .arrangeSteps(ids, this.scheduleId)
      .then(() => {
        this.loadData(); // ререндерим заново строки с бэкенда
      })
      .catch((error: any) => {
        this.loadingContent = false;
        this.errors = [error];
      });
  }
}
