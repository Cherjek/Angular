import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ScheduleResultComponent } from './components/schedule-result/schedule-result.component';
import { ScheduleResultLogComponent } from './components/schedule-result-log/schedule-result-log.component';
import { ScheduleResultStepsComponent } from './components/schedule-result-steps/schedule-result-steps.component';
import { ScheduleResultService } from 'src/app/services/schedules.module';

const routes: Routes = [
  {
    path: '',
    component: ScheduleResultComponent,
    children: [
      {
        path: '',
        redirectTo: 'log'
      },
      {
        path: 'log',
        component: ScheduleResultLogComponent
      },
      {
        path: 'steps',
        component: ScheduleResultStepsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  declarations: [],
  providers: [ScheduleResultService]
})
export class ScheduleResultRoutingModule {}
