import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegionsMainComponent } from './components/regions-main/regions-main.component';

const routes: Routes = [
  {
    path: '',
    component: RegionsMainComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegionsRoutingModule {}
