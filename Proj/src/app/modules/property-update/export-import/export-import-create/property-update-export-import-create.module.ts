import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ControlsModule } from '../../../../controls/ct.module';
import { SharedModule } from '../../../../shared/shared.module';
import { CoreModule } from '../../../../core/core.module';

import { PropertyUpdateEntityTypesService } from 'src/app/services/property-update/entity/property-update-entity-types.service';
import { PropertyUpdateExportImportCreateRoutingModule } from './property-update-export-import-create.routing.module';
import { PropertyUpdateExportImportCreateComponent } from './components/property-update-export-import-create/property-update-export-import-create.component';
import { ExpImpPropertyTreeComponent } from './components/property-tree/property-tree.component';

@NgModule({
  declarations: [
    PropertyUpdateExportImportCreateComponent,
    ExpImpPropertyTreeComponent
  ],
  imports: [
    CommonModule,
    ControlsModule,
    SharedModule,
    CoreModule,

    PropertyUpdateExportImportCreateRoutingModule
  ],
  providers: [
    PropertyUpdateEntityTypesService
  ],
})
export class PropertyUpdateExportImportCreateModule {}
