import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { NodeCreateComponent } from './components/node-create.component';

const routes: Routes = [
    {
        path: '',
        component: NodeCreateComponent
    }
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class NodeCreateRoutingModule { }