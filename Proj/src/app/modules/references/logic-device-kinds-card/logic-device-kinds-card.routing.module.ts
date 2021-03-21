import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LogicDeviceKindsCardMainComponent } from './components/logic-device-kinds-card-main/logic-device-kinds-card-main.component';
import { LogicDeviceKindsCardPropertyComponent } from './components/logic-device-kinds-card-property/logic-device-kinds-card-property.component';
import { LogicDeviceKindsCardParametersComponent } from './components/logic-device-kinds-card-parameters/logic-device-kinds-card-parameters.component';

const routes: Routes = [
  {
    path: '',
    component: LogicDeviceKindsCardMainComponent,
    children: [
      {
        path: '',
        redirectTo: 'property'
      },
      {
        path: 'property',
        component: LogicDeviceKindsCardPropertyComponent
      },
      {
        path: 'parameters',
        component: LogicDeviceKindsCardParametersComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LogicDeviceKindsCardRoutingModule {}
