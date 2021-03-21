import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PriceZonesPeakCardMainComponent } from './components/price-zones-peak-card-main/price-zones-peak-card-main.component';
import { PriceZonesPeakCardPropertyComponent } from './components/price-zones-peak-card-property/price-zones-peak-card-property.component';

const routes: Routes = [
  {
    path: '',
    component: PriceZonesPeakCardMainComponent,
    children: [
      {
        path: '',
        redirectTo: 'property',
      },
      {
        path: 'property',
        component: PriceZonesPeakCardPropertyComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PriceZonesPeakCardRoutingModule {}
