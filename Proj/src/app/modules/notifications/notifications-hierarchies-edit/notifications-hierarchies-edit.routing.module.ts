import {
    NotificationsHierarchiesEditComponent
 } from './components/notifications-hierarchies-edit/notifications-hierarchies-edit.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    component: NotificationsHierarchiesEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotificationsHierarchiesEditRoutingModule {}
