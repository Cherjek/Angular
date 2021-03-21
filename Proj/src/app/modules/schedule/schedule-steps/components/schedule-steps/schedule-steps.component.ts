import { Component, OnInit } from '@angular/core';
import { ScheduleStepService } from 'src/app/services/schedules.module';
import { finalize } from 'rxjs/operators';
import { IScheduleStep } from 'src/app/services/schedules.module';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'rom-schedule-steps',
    templateUrl: './schedule-steps.component.html',
    styleUrls: ['./schedule-steps.component.less']
})
export class ScheduleStepsComponent implements OnInit {

    loadingContent = false;
    errors: any[] = [];
    steps: IScheduleStep[];
    idSchedule: number;

    constructor(
        private scheduleStepsService: ScheduleStepService, 
        private activatedRoute: ActivatedRoute,
        private router: Router) { }

    ngOnInit() {
        this.idSchedule = this.activatedRoute.snapshot.params.idSchedule;

        this.loadData();
    }

    itemClick(listItem: any) {
        const step = listItem.Data as IScheduleStep;
        const url = step.Id === 1 ? 'step-requests' :
                        step.Id === 3 ? 'step-reports' :
                        step.Id === 2 ? 'step-manage' : '';
        
        this.router.navigate([`schedule-module/schedule/${this.idSchedule}/${url}/new/step/${step.Id}`]);
    }

    private loadData() {
        this.loadingContent = true;
        this.scheduleStepsService
            .getStepTypes()
            .pipe(finalize(() => (this.loadingContent = false)))
            .subscribe(
                (steps: IScheduleStep[]) => {
                    this.steps = steps.filter(x => x.Id !== 2);
                },
                error => {
                    this.errors = [error];
                }
            );
    }
}
