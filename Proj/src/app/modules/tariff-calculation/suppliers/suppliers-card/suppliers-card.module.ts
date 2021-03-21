import { SupplierAdditionComponent } from './components/supplier-addition/supplier-addition.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlsModule } from 'src/app/controls/ct.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreModule } from 'src/app/core/core.module';
import { SharedHierarchyModule } from 'src/app/modules/additionally-hierarchies/shared/shared.module';
import { SuppliersCardComponent } from './components/suppliers-card/suppliers-card.component';
import { SuppliersCardRoutes } from './suppliers-card.routing';
import { SuppliersService } from 'src/app/services/taiff-calculation/suppliers/suppliers.service';
import { RegionsService } from 'src/app/services/taiff-calculation/regions/Regions.service';
import { PropertyComponent } from './components/property/property.component';
import { SuppliersInfrastructureService } from 'src/app/services/taiff-calculation/suppliers/suppliers-infrastructure.service';
import { SuppliersPeakPowersService } from 'src/app/services/taiff-calculation/suppliers/suppliers-peak-powers.service';
import { SupplierEnergyPriceComponent } from './components/supplier-energy-price/supplier-energy-price.component';

@NgModule({
  imports: [
    CommonModule,
    ControlsModule,
    SharedModule,
    SharedHierarchyModule,
    CoreModule,
    SuppliersCardRoutes,
  ],
  declarations: [
    SuppliersCardComponent,
    PropertyComponent,
    SupplierAdditionComponent,
    SupplierEnergyPriceComponent,
  ],
  providers: [
    SuppliersService,
    RegionsService,
    SuppliersInfrastructureService,
    SuppliersPeakPowersService,
  ],
})
export class SuppliersCardModule {}
