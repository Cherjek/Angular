import { SupplierEnergyPriceCardParamsComponent } from './components/supplier-energy-price-card-params/supplier-energy-price-card-params.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlsModule } from 'src/app/controls/ct.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreModule } from 'src/app/core/core.module';
import { SharedHierarchyModule } from 'src/app/modules/additionally-hierarchies/shared/shared.module';
import { SuppliersService } from 'src/app/services/taiff-calculation/suppliers/suppliers.service';
import { SupplierEnergyPriceCardRouting } from './supplier-energy-price-card.routing.module';
import { SupplierEnergyPriceCardComponent } from './components/supplier-energy-price-card/supplier-energy-price-card.component';

@NgModule({
  imports: [
    CommonModule,
    ControlsModule,
    SharedModule,
    SharedHierarchyModule,
    CoreModule,
    SupplierEnergyPriceCardRouting,
  ],
  declarations: [
    SupplierEnergyPriceCardComponent,
    SupplierEnergyPriceCardParamsComponent,
  ],
  providers: [SuppliersService],
})
export class SupplierEnergyPriceCardModule {}
