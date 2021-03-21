import { AppLocalization } from 'src/app/common/LocaleRes';
import { SupplierEnergyPriceComponent } from './components/supplier-energy-price/supplier-energy-price.component';
import { SupplierAdditionComponent } from './components/supplier-addition/supplier-addition.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { SuppliersCardComponent } from './components/suppliers-card/suppliers-card.component';
import { PropertyComponent } from './components/property/property.component';
import { InlineGridComponent } from 'src/app/shared/rom-forms/inline-grid/inline-grid.component';
import { SuppliersInfrastructureService } from 'src/app/services/taiff-calculation/suppliers/suppliers-infrastructure.service';
import { InlineGridColumn } from 'src/app/shared/rom-forms/inline-grid/models/InlineGridColumn';
import { SuppliersPeakPowersService } from 'src/app/services/taiff-calculation/suppliers/suppliers-peak-powers.service';
import { CanAccessGuard } from 'src/app/core';
import { DataColumnType } from 'src/app/controls/DataGrid';

const routes: Routes = [
  {  
    path: '',
    component: SuppliersCardComponent,
    children: [
      {
        path: '',
        redirectTo: 'property'
      },
      {
        path: 'property',
        component: PropertyComponent
      },
      {
        path: 'energy-price',
        component: SupplierEnergyPriceComponent,
        data: { access: 'TC_ENERGY_PRICE_VIEW' },
        canActivate: [CanAccessGuard]
      },
      {
        path: 'addition',
        component: SupplierAdditionComponent,
        data: { access: 'TC_ADDITION_VIEW' },
        canActivate: [CanAccessGuard]
      },
      {
        path: 'infrastructure',
        component: InlineGridComponent,
        data: {
          service: SuppliersInfrastructureService,
          columns: [
            {
              Name: 'Date',
              Caption: AppLocalization.StartActionDate,
              Type: 'Date',
              DataType: DataColumnType.DateTime,
            },
            {
              Name: 'Value',
              Caption: AppLocalization.ValueRubMvtH,
              InputType: 'float'
            }
          ] as InlineGridColumn[],
          access: { add: 'TC_INFRASTRUCTURE_ADD', edit: 'TC_INFRASTRUCTURE_EDIT', delete: 'TC_INFRASTRUCTURE_DELETE' }
        }
      },
      {
        path: 'fact-peak-power',
        component: InlineGridComponent,
        data: {
          service: SuppliersPeakPowersService,
          columns: [
            {
              Name: 'Date',
              Caption: AppLocalization.Date,
              Type: 'Date',
              DataType: DataColumnType.DateTime,
            },
            {
              Name: 'Value',
              Caption: AppLocalization.Hour,
              InputType: 'number'
            }
          ] as InlineGridColumn[],
          access: { add: 'TC_FACT_PEAK_HOURS_ADD', edit: 'TC_FACT_PEAK_HOURS_EDIT', delete: 'TC_FACT_PEAK_HOURS_DELETE' }
        }
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuppliersCardRoutes {};
