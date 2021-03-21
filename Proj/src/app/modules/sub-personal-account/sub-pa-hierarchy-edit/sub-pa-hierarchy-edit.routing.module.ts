import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SubPaHierarchyEditComponent } from './components/sub-pa-hierarchy-edit/sub-pa-hierarchy-edit.component';

const routes: Routes = [
  {
    path: '',
    component: SubPaHierarchyEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubPaHierarchyEditRoutingModule {}
