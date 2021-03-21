import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TypeLogicDevicesOptionsCardComponent } from './components/options-card/options-card.component';
import { TypeLogicDevicesOptionsPropertyCardComponent } from './components/options-property-card/options-property-card.component';

const routes: Routes = [
  {
    path: '',
    component: TypeLogicDevicesOptionsCardComponent,
    children: [
      {
        path: '',
        redirectTo: 'property'
      },
      {
        path: 'property',
        component: TypeLogicDevicesOptionsPropertyCardComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  declarations: []
})
export class TypesCommandsLogicDevicesOptionRoutingModule {}
