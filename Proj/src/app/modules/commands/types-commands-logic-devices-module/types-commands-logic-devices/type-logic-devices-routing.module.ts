import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommandsTypeLogicDevicesMainComponent } from './components/main/main.component';

const routes: Routes = [
  {
    path: '',
    component: CommandsTypeLogicDevicesMainComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  declarations: []
})
export class TypesCommandsLogicDevicesRoutingModule {}
