import { PaHierarchyNodesComponent } from './components/pa-hierarchy-nodes/pa-hierarchy-nodes.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PaSubscribersCardPropertyComponent } from './components/pa-subscribers-card-property/pa-subscribers-card-property.component';
import { PaSubscribersCardComponent } from './components/pa-subscribers-card/pa-subscribers-card.component';
import { CanAccessGuard } from 'src/app/core';

const routes: Routes = [
  {
    path: '',
    component: PaSubscribersCardComponent,
    children: [
      {
        path: '',
        redirectTo: 'property',
      },
      {
        path: 'property',
        component: PaSubscribersCardPropertyComponent,
        data: { access: 'CPA_VIEW_CUSTOMER', noAccessNavigateTo: 'hierarchy-nodes' },
        canActivate: [CanAccessGuard]
      },
      {
        path: 'hierarchy-nodes',
        component: PaHierarchyNodesComponent,
        data: { access: 'CPA_VIEW_CUSTOMER_NODES' },
        canActivate: [CanAccessGuard]
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaSubscribersCardRoutingModule {}
