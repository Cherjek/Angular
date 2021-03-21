import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ScheduleHierarchiesEditComponent } from './components/schedule-hierarchies-edit.component';

const routes: Routes = [{
    path: '',
    component: ScheduleHierarchiesEditComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScheduleHierarchiesEditRoutingModule { }
