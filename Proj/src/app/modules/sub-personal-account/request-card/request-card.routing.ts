import { PaRequestCardRejectComponent } from './components/pa-request-card-reject/pa-request-card-reject.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { PaRequestCardComponent } from './components/pa-request-card/pa-request-card.component';
import { PaRequestCardMainComponent } from './components/pa-request-card-main/pa-request-card-main.component';
import { PaRequestCardHierarchyNodeComponent } from './components/pa-request-card-hierarchy-node/pa-request-card-hierarchy-node.component';
import { PaRequestCardFilesComponent } from './components/pa-request-card-files/pa-request-card-files.component';

const routes: Routes = [
  {
    path: '',
    component: PaRequestCardComponent,
    children: [
      { path: '', redirectTo: 'main' },
      { path: 'main', component: PaRequestCardMainComponent },
      {
        path: 'hierarchy-nodes',
        component: PaRequestCardHierarchyNodeComponent,
      },
      {
        path: 'files',
        component: PaRequestCardFilesComponent,
      },
      {
        path: 'reject',
        component: PaRequestCardRejectComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PersonalAccountRequestCardRoutes {}
