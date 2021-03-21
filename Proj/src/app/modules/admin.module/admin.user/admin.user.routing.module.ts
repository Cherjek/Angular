import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminUserComponent } from './admin.user';
import { AdminUserPropertiestComponent } from './admin.user.properties/admin.user.properties';
import { CanAccessGuard } from 'src/app/core';

const routes: Routes = [
  {
    path: '',
    component: AdminUserComponent,
    children: [
      { path: '', redirectTo: 'properties', pathMatch: 'full' },
      {
        path: 'properties',
        component: AdminUserPropertiestComponent,
        data: { access: ['ADM_USERS_ALLOW', 'ADM_VIEW_USER_PROPERTIES'] },
        canActivate: [CanAccessGuard]
      }
    ],
    data: { access: 'ADM_USERS_ALLOW' },
    canActivate: [CanAccessGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [],
  declarations: []
})
export class AdminUserRoutingModule {}
