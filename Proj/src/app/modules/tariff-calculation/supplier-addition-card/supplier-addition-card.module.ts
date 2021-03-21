import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlsModule } from 'src/app/controls/ct.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreModule } from 'src/app/core/core.module';
import { SharedHierarchyModule } from '../../additionally-hierarchies/shared/shared.module';
import { SupplierAdditionCardFilesComponent } from './components/supplier-addition-card-files/supplier-addition-card-files.component';
import { SupplierAdditionCardMainComponent } from './components/supplier-addition-card-main/supplier-addition-card-main.component';
import { SupplierAdditionCardPropertyComponent } from './components/supplier-addition-card-property/supplier-addition-card-property.component';
import { SupplierAdditionCardRoutingModule } from './supplier-addition-card.routing.module';
import { SuppliersService } from 'src/app/services/taiff-calculation/suppliers/suppliers.service';

@NgModule({
  imports: [
    CommonModule,
    ControlsModule,
    SharedModule,
    CoreModule,
    SharedHierarchyModule,
    SupplierAdditionCardRoutingModule,
  ],
  declarations: [
    SupplierAdditionCardMainComponent,
    SupplierAdditionCardPropertyComponent,
    SupplierAdditionCardFilesComponent,
  ],
  providers: [SuppliersService],
})
export class SupplierAdditionCardModule {}
