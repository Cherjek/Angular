import { RegionsCardTransferComponent } from './components/regions-card-transfer/regions-card-transfer.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegionsCardPropertyComponent } from './components/regions-card-property/regions-card-property.component';
import { RegionsCardComponent } from './components/regions-card/regions-card.component';
import { CanAccessGuard } from 'src/app/core';

const routes: Routes = [
  {
    path: '',
    component: RegionsCardComponent,
    children: [
      {
        path: '',
        redirectTo: 'property',
      },
      {
        path: 'property',
        component: RegionsCardPropertyComponent,
      },
      {
        path: 'transfers',
        component: RegionsCardTransferComponent,
        data: { access: 'TC_TRANSFER_TARIFF_VIEW' },
        canActivate: [CanAccessGuard]
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegionsCardRoutingModule {}
