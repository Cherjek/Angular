import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PaApplicationsMainComponent } from './components/pa-applications-main/pa-applications-main.component';

const routes: Routes = [
  {
    path: '',
    component: PaApplicationsMainComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaApplicationsRoutingModule {}
