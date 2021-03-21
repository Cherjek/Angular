import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OesDayZoneCardMainComponent } from './components/oes-day-zone-card-main/oes-day-zone-card-main.component';
import { OesDayZoneCardPropertyComponent } from './components/oes-day-zone-card-property/oes-day-zone-card-property.component';

const routes: Routes = [
  {
    path: '',
    component: OesDayZoneCardMainComponent,
    children: [
      {
        path: '',
        redirectTo: 'property',
      },
      {
        path: 'property',
        component: OesDayZoneCardPropertyComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OesDayZoneCardRoutingModule {}
