import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NodeLogicDevicesEditComponent } from './components/node-logic-devices-edit.component';

const routes: Routes = [
    {
        path: '',
        component: NodeLogicDevicesEditComponent
    }
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class NodeLogicDevicesEditRoutingModule { }