import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminUsersComponent } from './admin.users';
import { AdminUsersMainComponent } from './admin.users.main/admin.users.main';
import { CanAccessGuard } from 'src/app/core';

const routes: Routes = [
  {
    path: '',
    component: AdminUsersComponent,
    children: [
      { path: '', redirectTo: 'main', pathMatch: 'full' },
      {
        path: 'main',
        component: AdminUsersMainComponent,
        data: { access: 'ADM_USERS_ALLOW' },
        canActivate: [CanAccessGuard]
      }
    ],
    data: { access: 'ADM_USERS_ALLOW' },
    canActivate: [CanAccessGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  declarations: []
})
export class AdminUsersRoutingModule {}
