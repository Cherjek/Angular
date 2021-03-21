import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotificationsMainComponent } from './components/notifications-main/notifications-main.component';

const routes: Routes = [
  {
    path: '',
    component: NotificationsMainComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotificationsRoutingModule {}
