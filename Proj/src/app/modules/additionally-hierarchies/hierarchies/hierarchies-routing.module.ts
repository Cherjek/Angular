import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {HierarchiesComponent} from "./components/hierarchies.component";

const routes: Routes = [
    {
        path: '',
        component: HierarchiesComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HierarchiesRoutingModule {
}
