import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { TariffCalculationCreateComponent } from './components/tariff-calculation.component';

const routes: Routes = [
  {  
    path: '',
    component: TariffCalculationCreateComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TariffCalculationRoutes {};
