import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PropertyTreeComponent } from './components/property-tree/property-tree.component';

const routes: Routes = [
  {
    path: '',
    component: PropertyTreeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PropertiesTreeRoutingModule {}
