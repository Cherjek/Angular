import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SubDocumentsCardPropertyComponent } from './components/sub-documents-card-property/sub-documents-card-property.component';
import { SubDocumentsCardComponent } from './components/sub-documents-card/sub-documents-card.component';

const routes: Routes = [
  {
    path: '',
    component: SubDocumentsCardComponent,
    children: [
      {
        path: '',
        redirectTo: 'property',
      },
      {
        path: 'property',
        component: SubDocumentsCardPropertyComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubDocumentsCardRoutingModule {}
