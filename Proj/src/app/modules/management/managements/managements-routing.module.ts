import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManagementsMainComponent } from './components/managements-main/managements-main.component';

const routes: Routes = [
  {
    path: '',
    component: ManagementsMainComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagementsRoutingModule {}
