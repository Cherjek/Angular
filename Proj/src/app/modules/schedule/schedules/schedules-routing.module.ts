import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SchedulesMainComponent } from './components/schedules-main/schedules-main.component';

const routes: Routes = [
  {
    path: '',
    component: SchedulesMainComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SchedulesRoutingModule {}
