import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TariffTransferCardFilesComponent } from './components/tariff-transfer-card-files/tariff-transfer-card-files.component';
import { TariffTransferCardMainComponent } from './components/tariff-transfer-card-main/tariff-transfer-card-main.component';
import { TariffTransferCardPropertyComponent } from './components/tariff-transfer-card-property/tariff-transfer-card-property.component';

const routes: Routes = [
  {
    path: '',
    component: TariffTransferCardMainComponent,
    children: [
      {
        path: '',
        redirectTo: 'property',
      },
      {
        path: 'property',
        component: TariffTransferCardPropertyComponent,
      },
      {
        path: 'files',
        component: TariffTransferCardFilesComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TariffTransferCardRoutingModule {}
