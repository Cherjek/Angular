import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlsModule } from 'src/app/controls/ct.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreModule } from 'src/app/core/core.module';
import { PuExportImportService } from 'src/app/services/property-update/filters/pu-export-import.service';
import { PropertyUpdateExportImportResultLogComponent } from './components/property-update-export-import-result-log/property-update-export-import-result-log.component';
import { PropertyUpdateExportImportResultParametersComponent } from './components/property-update-export-import-result-parameters/property-update-export-import-result-parameters.component';
import { PropertyUpdateExportImportResultComponent } from './components/property-update-export-import-result/property-update-export-import-result.component';
import { PropertyUpdateExportImportResultRoutingModule } from './property-update-export-import-result.routing.module';
import { PropertyUpdateExportImportResultParametersNewComponent } from './components/property-update-export-import-result-parameters-new/property-update-export-import-result-parameters-new.component';

@NgModule({
  imports: [
    CommonModule,
    ControlsModule,
    SharedModule,
    CoreModule,
    PropertyUpdateExportImportResultRoutingModule,
  ],
  declarations: [
    PropertyUpdateExportImportResultComponent,
    PropertyUpdateExportImportResultLogComponent,
    PropertyUpdateExportImportResultParametersComponent,
    PropertyUpdateExportImportResultParametersNewComponent
  ],
  providers: [PuExportImportService],
})
export class PropertyUpdateExportImportResultModule {}
