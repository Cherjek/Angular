import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PaSubDocumentsMainComponent } from './components/pa-sub-documents-main/pa-sub-documents-main.component';

const routes: Routes = [
  {
    path: '',
    component: PaSubDocumentsMainComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaSubDocumentsRoutingModule {}
