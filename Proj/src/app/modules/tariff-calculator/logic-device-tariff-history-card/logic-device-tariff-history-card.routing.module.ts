import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LogicDeviceTariffHistoryCardMainComponent } from './components/logic-device-tariff-history-card-main/logic-device-tariff-history-card-main.component';
import { LogicDeviceTariffHistoryCardPropertyComponent } from './components/logic-device-tariff-history-card-property/logic-device-tariff-history-card-property.component';

const routes: Routes = [
  {
    path: '',
    component: LogicDeviceTariffHistoryCardMainComponent,
    children: [
      {
        path: '',
        redirectTo: 'property',
      },
      {
        path: 'property',
        component: LogicDeviceTariffHistoryCardPropertyComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LogicDeviceTariffHistoryCardRoutingModule {}
