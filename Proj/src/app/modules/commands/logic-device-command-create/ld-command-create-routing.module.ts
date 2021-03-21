import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { LDCommandCreateComponent } from './components/create.component';

const routes: Routes = [
    {
        path: '',
        component: LDCommandCreateComponent
    }
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LogicDeviceCommandCreateRoutingModule { }