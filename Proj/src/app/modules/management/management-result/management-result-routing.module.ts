import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManagementResultComponent } from './components/management-result/management-result.component';
import { ManagementResultLogComponent } from './components/management-result-log/management-result-log.component';
import { ManagementResultParametersComponent } from './components/management-result-parameters/management-result-parameters.component';
import { ManagementResultStepsComponent } from './components/management-result-steps/management-result-steps.component';
import { CanAccessGuard } from 'src/app/core';

const routes: Routes = [
  {
    path: '',
    component: ManagementResultComponent,
    children: [
        {
          path: '',
          redirectTo: 'log'
        },
        {
          path: 'log',
          component: ManagementResultLogComponent,
          data: { access: 'CMD_VIEW_LOG', noAccessNavigateTo: 'parameters' },
          canActivate: [CanAccessGuard]
        },
        {
          path: 'parameters',
          component: ManagementResultParametersComponent
        },
        {
          path: 'steps',
          component: ManagementResultStepsComponent,
          data: { access: 'CMD_VIEW_STEPS', noAccessNavigateTo: 'parameters' },
          canActivate: [CanAccessGuard]
        }
      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  declarations: []
})
export class ManagementResultRoutingModule {}
