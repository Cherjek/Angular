import { AppLocalization } from 'src/app/common/LocaleRes';
import { SuppliersHourValuesService } from './../../../services/taiff-calculation/suppliers/suppliers-hour-values.service';
import { InlineGridComponent } from 'src/app/shared/rom-forms/inline-grid/inline-grid.component';
import { SupplierEnergyPriceCardParamsComponent } from './components/supplier-energy-price-card-params/supplier-energy-price-card-params.component';
import { SupplierEnergyPriceCardComponent } from './components/supplier-energy-price-card/supplier-energy-price-card.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { InlineGridColumn } from 'src/app/shared/rom-forms/inline-grid/models/InlineGridColumn';
import { DataColumnType } from 'src/app/controls/DataGrid';

const routes: Routes = [
  {
    path: '',
    component: SupplierEnergyPriceCardComponent,
    children: [
      {
        path: '',
        redirectTo: 'params',
      },
      {
        path: 'params',
        component: SupplierEnergyPriceCardParamsComponent,
      },
      {
        path: 'hour-diff',
        component: InlineGridComponent,
        data: {
          service: SuppliersHourValuesService,
          noAdd: true,
          noDelete: true,
          columns: [
            {
              Name: 'Date',
              Caption: AppLocalization.Date,
              Type: 'Date',
              ReadOnly: true,
              Width: 150,
              DataType: DataColumnType.DateTime,
            },
            {
              Name: 'Hour',
              Caption: AppLocalization.HoursNumbDay,
              ReadOnly: true,
              Type: 'float',
              Width: 150
            },
            {
              Name: 'Pc34Cost',
              Caption:
                AppLocalization.TariffCalcLabel5,
              Type: 'float',
              Width: 350
            },
            {
              Name: 'Pc56Cost',
              Caption:
                AppLocalization.TariffCalcLabel6,
              Type: 'float',
              Width: 350
            },
            {
              Name: 'Pc56FactOverCost',
              Caption:
                AppLocalization.TariffCalcLabel4,
              Type: 'float',
              Width: 350
            },
            {
              Name: 'Pc56PlanOverCost',
              Caption:
                AppLocalization.TariffCalcLabel3,
              Type: 'float',
              Width: 350
            },
          ] as InlineGridColumn[],
          access: {
            add: 'none',
            delete: 'none',
            edit: 'TC_ENERGY_PRICE_PER_HOUR_EDIT'
          },
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class SupplierEnergyPriceCardRouting {}
