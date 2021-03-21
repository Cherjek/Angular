import { NgModule } from '@angular/core';
import { ExportReferencesComponent } from './export-references/export-references.component';
import { ImportReferencesComponent } from './import-references/import-references.component';
import { CommonModule } from '@angular/common';
import { ControlsModule } from 'src/app/controls/ct.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreModule } from 'src/app/core/core.module';
import { SharedHierarchyModule } from 'src/app/components/shared/shared.module';
import { MainImportExportReferencesComponent } from './main-import-export-references/main-import-export-references.component';
import { ImportExportReferencesRoutingModule } from './import-export-references.routing.module';
import { DeviceChannelTypesService } from 'src/app/services/references/device-channel-types.service';
import { GeographyService } from 'src/app/services/references/geography.service';
import { DataQueryTypesService } from 'src/app/services/references/data-query-types.service';
import { DataQueryMainService, DataQuerySettingsService } from 'src/app/services/data-query';
import { LogicDeviceTypesService } from 'src/app/services/configuration/logic-device-types.service';
import { DevicePropertyTypesService } from 'src/app/services/references/device-property-types.service';
import { LogicDevicePropertyTypesService } from 'src/app/services/references/logic-device-property-types.service';
import { LogicTagTypesService } from 'src/app/services/references/logic-tag-types.service';
import { ReferenceDeviceCommandTypesService } from 'src/app/services/commands/Reference/reference-device-command-types.service';
import { ConfigCommandDeviceTypesService } from 'src/app/services/commands/Configuration/DeviceLogicTypesCommandService.service';
import { ExportReferenceService } from 'src/app/services/import-export/references/export-reference.service';
import { ImportReferenceService } from 'src/app/services/import-export/references/import-reference.service';
import { UploadReferenceComponent } from './upload-reference/upload-reference.component';

@NgModule({
  imports: [
    CommonModule,
    ControlsModule,
    SharedModule,
    CoreModule,
    SharedHierarchyModule,
    ImportExportReferencesRoutingModule
  ],
  declarations: [
    ExportReferencesComponent,
    ImportReferencesComponent,
    UploadReferenceComponent,
    MainImportExportReferencesComponent
  ],
  providers: [
    DeviceChannelTypesService,
    GeographyService,
    DataQueryTypesService,
    DataQueryMainService,
    LogicDeviceTypesService,
    DevicePropertyTypesService,
    LogicDevicePropertyTypesService,
    LogicTagTypesService,
    ReferenceDeviceCommandTypesService,
    DataQuerySettingsService,
    ConfigCommandDeviceTypesService,
    ExportReferenceService,
    ImportReferenceService
  ]
})
export class ImportExportReferencesModule {}
