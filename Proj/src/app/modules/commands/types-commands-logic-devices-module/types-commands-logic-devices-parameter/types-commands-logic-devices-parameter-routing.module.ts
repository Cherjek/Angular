import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TypeLogicDevicesParameterComponent } from './components/parameter/parameter.component';
import { TypeLogicDevicesPropertyComponent } from './components/property/property.component';
import { TypeLogicDevicesParameterOptionsComponent } from './components/options/options.component';

const routes: Routes = [
  {
    path: '',
    component: TypeLogicDevicesParameterComponent,
    children: [
      {
        path: '',
        redirectTo: 'property'
      },
      {
        path: 'property',
        component: TypeLogicDevicesPropertyComponent
      },
      {
        path: 'options',
        component: TypeLogicDevicesParameterOptionsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  declarations: []
})
export class TypesCommandsLogicDevicesParameterRoutingModule {}
