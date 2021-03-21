import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminGroupsComponent } from './admin.groups';
import { AdminGroupsMainComponent } from './admin.groups.main/admin.groups.main';
import { CanAccessGuard } from 'src/app/core';

const routes: Routes = [
  {
    path: '',
    component: AdminGroupsComponent,
    children: [
      { path: '', redirectTo: 'main', pathMatch: 'full' },
      {
        path: 'main',
        component: AdminGroupsMainComponent,
        data: { access: 'ADM_GROUPS_ALLOW' },
        canActivate: [CanAccessGuard]
      }
    ],
    data: { access: 'ADM_GROUPS_ALLOW' },
    canActivate: [CanAccessGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  declarations: []
})
export class AdminGroupsRoutingModule {}
