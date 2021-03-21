import { NotificationsCardHierachiesComponent } from './components/notifications-card-hierachies/notifications-card-hierachies.component';
import { NotificationsCardSubSystemsComponent } from './components/notifications-card-sub-systems/notifications-card-sub-systems.component';
import { NotificationsCardAddressComponent } from './components/notifications-card-address/notifications-card-address.component';
import { NotificationsCardPropertyComponent } from './components/notifications-card-property/notifications-card-property.component';
import { NotificationsCardComponent } from './components/notifications-card/notifications-card.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CanAccessGuard } from 'src/app/core';

const routes: Routes = [
  {
    path: '',
    component: NotificationsCardComponent,
    children: [
      {
        path: '',
        redirectTo: 'property',
      },
      {
        path: 'property',
        component: NotificationsCardPropertyComponent
      },
      {
        path: 'address',
        component: NotificationsCardAddressComponent,
        data: { access: ['ES_NTF_ADDRESSES_VIEW'] },
        canActivate: [CanAccessGuard]
      },
      {
        path: 'subsystems',
        component: NotificationsCardSubSystemsComponent,
        data: { access: ['ES_NTF_SUBSYSTEMS_VIEW'] },
        canActivate: [CanAccessGuard]
      },
      {
        path: 'hierachies',
        component: NotificationsCardHierachiesComponent,
        data: { access: ['ES_NTF_HIERARCHY_VIEW'] },
        canActivate: [CanAccessGuard]
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  declarations: [],
  providers: [],
})
export class NotificationsCardRoutingModule {}
