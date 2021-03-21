import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PaSubscribersMainComponent } from './components/pa-subscribers-main/pa-subscribers-main.component';

const routes: Routes = [
  {
    path: '',
    component: PaSubscribersMainComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaSubscribersRoutingModule {}
