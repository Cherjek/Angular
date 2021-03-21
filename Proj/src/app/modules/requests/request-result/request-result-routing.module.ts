import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RequestResultComponent } from './components/request-result/request-result.component';
import { RequestResultLogComponent } from './components/request-result-log/request-result-log.component';
import { RequestResultEquipmentsComponent } from './components/request-result-equipments/request-result-equipments.component';
import { RequestResultParametersComponent } from './components/request-result-parameters/request-result-parameters.component';
import { RequestResultStepsComponent } from './components/request-result-steps/request-result-steps.component';
import { CanAccessGuard } from 'src/app/core';

const routes: Routes = [
  {
    path: '',
    component: RequestResultComponent,
    children: [
      {
        path: '',
        redirectTo: 'log'
      },
      {
        path: 'log',
        component: RequestResultLogComponent,
        data: { access: 'DQ_VIEW_LOG', noAccessNavigateTo: 'parameters' },
        canActivate: [CanAccessGuard]
      },
      {
        path: 'logic-devices',
        component: RequestResultEquipmentsComponent
      },
      {
        path: 'parameters',
        component: RequestResultParametersComponent
      },
      {
        path: 'steps',
        component: RequestResultStepsComponent,
        data: { access: 'DQ_VIEW_STEPS', noAccessNavigateTo: 'parameters' },
        canActivate: [CanAccessGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestResultRoutingModule {}
