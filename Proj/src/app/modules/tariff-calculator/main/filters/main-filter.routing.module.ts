import { TariffCalculatorMainFiltersLogComponent } from './components/tariff-calculator-main-filters-log/tariff-calculator-main-filters-log.component';
import { TariffCalculatorMainFiltersParametersComponent } from './components/tariff-calculator-main-filters-parameters/tariff-calculator-main-filters-parameters.component';
import { TariffCalculatorMainFilterComponent } from './components/tariff-calculator-main-filter/tariff-calculator-main-filter.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CanAccessGuard } from 'src/app/core';

const routes: Routes = [
  {
    path: '',
    component: TariffCalculatorMainFilterComponent,
    children: [
      {
        path: '',
        redirectTo: 'parameters',
      },
      {
        path: 'parameters',
        component: TariffCalculatorMainFiltersParametersComponent,
      },
      {
        path: 'log',
        component: TariffCalculatorMainFiltersLogComponent,
        data: { access: 'TC_VIEW_LOG' },
        canActivate: [CanAccessGuard]
      },
      
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainFilterRoutingModule {}
