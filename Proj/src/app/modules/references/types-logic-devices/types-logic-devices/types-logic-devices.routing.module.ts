import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TypesLogicDevicesMainComponent } from './components/types-logic-devices-main/types-logic-devices-main.component';

const routes: Routes = [
  {
    path: '',
    component: TypesLogicDevicesMainComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TypesLogicDevicesRoutingModule {}
