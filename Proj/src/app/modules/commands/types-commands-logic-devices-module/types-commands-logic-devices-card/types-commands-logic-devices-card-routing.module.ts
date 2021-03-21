import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommandsTypeLogicDevicesCardComponent } from './components/card/card.component';
import { CommandsTypeLogicDevicesCardPropertiesComponent } from './components/card-properties/card-properties.component';
import { CardParametersComponent } from './components/card-parameters/card-parameters.component';

const routes: Routes = [
  {
    path: '',
    component: CommandsTypeLogicDevicesCardComponent,
    children: [
      {
        path: '',
        redirectTo: 'property'
      },
      {
        path: 'property',
        component: CommandsTypeLogicDevicesCardPropertiesComponent
      },
      {
        path: 'parameters',
        component: CardParametersComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  declarations: []
})
export class TypesCommandsLogicDevicesCardRoutingModule {}
