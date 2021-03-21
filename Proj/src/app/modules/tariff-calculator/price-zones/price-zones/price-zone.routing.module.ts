import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PriceZoneMainComponent } from './components/price-zone-main/price-zone-main.component';

const routes: Routes = [
  {
    path: '',
    component: PriceZoneMainComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PriceZoneRoutingModule {}
