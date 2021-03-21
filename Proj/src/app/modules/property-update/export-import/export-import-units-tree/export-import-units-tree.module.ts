import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { UnitsTreeComponent } from './components/export-import-units-tree';
import { PropertyUpdateEntityTypesService } from 'src/app/services/property-update/entity/property-update-entity-types.service';
import { ExportImportUnitsTreeRoutingModule } from './export-import-units-tree.routing.module';
import { ControlsModule } from 'src/app/controls/ct.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreModule } from 'src/app/core/core.module';
import { EntitiesBasketComponent } from './components/entities-basket/entities-basket.component';

@NgModule({
  declarations: [
    EntitiesBasketComponent
  ],
  imports: [
    CommonModule,
    ControlsModule,
    SharedModule,
    CoreModule,

    ExportImportUnitsTreeRoutingModule
  ],
  providers: [
    PropertyUpdateEntityTypesService
  ],
})
export class ExportImportUnitsTreeModule { }
