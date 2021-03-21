import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HierarchyMainComponent } from './components/hierarchy-main/hierarchy-main.component';

const routes: Routes = [{
    path: '',
    component: HierarchyMainComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HierarchyMainRoutingModule { }
