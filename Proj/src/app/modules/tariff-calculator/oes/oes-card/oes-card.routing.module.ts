import { OesCardDayZonesComponent } from './components/oes-card-day-zones/oes-card-day-zones.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OesCardPropertyComponent } from './components/oes-card-property/oes-card-property.component';
import { OesCardComponent } from './components/oes-card/oes-card.component';
import { CanAccessGuard } from 'src/app/core';

const routes: Routes = [
  {
    path: '',
    component: OesCardComponent,
    children: [
      {
        path: '',
        redirectTo: 'property',
      },
      {
        path: 'property',
        component: OesCardPropertyComponent,
      },
      {
        path: 'day-zones',
        component: OesCardDayZonesComponent,
        data: { access: 'TC_DAY_ZONE_VIEW' },
        canActivate: [CanAccessGuard]
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OesCardRoutingModule {}
