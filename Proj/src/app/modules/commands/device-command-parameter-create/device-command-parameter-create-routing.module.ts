import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeviceTypeParametersComponent } from './components/device-type-parameters/device-type-parameters.component';


const routes: Routes = [{
    path: '',
    component: DeviceTypeParametersComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeviceCommandParameterCreateRoutingModule { }
