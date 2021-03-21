import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OesMainComponent } from './components/oes-main/oes-main.component';

const routes: Routes = [
  {
    path: '',
    component: OesMainComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OesRoutingModule {}
