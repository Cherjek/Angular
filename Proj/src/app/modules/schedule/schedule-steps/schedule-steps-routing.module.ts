import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ScheduleStepsComponent } from './components/schedule-steps/schedule-steps.component';

const routes: Routes = [{
    path: '',
    component: ScheduleStepsComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScheduleStepsRoutingModule { }
