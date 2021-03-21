import { PriceZonesCardPeaksComponent } from './components/price-zones-card-peaks/price-zones-card-peaks.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PriceZonesCardPropertyComponent } from './components/price-zones-card-property/price-zones-card-property.component';
import { PriceZonesCardComponent } from './components/price-zones-card/price-zones-card.component';
import { CanAccessGuard } from 'src/app/core';

const routes: Routes = [
  {
    path: '',
    component: PriceZonesCardComponent,
    children: [
      {
        path: '',
        redirectTo: 'property',
      },
      {
        path: 'property',
        component: PriceZonesCardPropertyComponent,
      },
      {
        path: 'peak-hours',
        component: PriceZonesCardPeaksComponent,
        data: { access: 'TC_PLAN_PEAK_HOURS_VIEW' },
        canActivate: [CanAccessGuard]
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PriceZonesCardRoutingModule {}
