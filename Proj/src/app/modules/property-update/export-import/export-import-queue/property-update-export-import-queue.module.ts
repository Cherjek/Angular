import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ControlsModule } from '../../../../controls/ct.module';
import { SharedModule } from '../../../../shared/shared.module';
import { CoreModule } from '../../../../core/core.module';

import { PropertyUpdateExportImportQueueRoutingModule } from './property-update-export-import-queue.routing.module';
import { PropertyUpdateLogComponent } from './containers/property-update-log/property-update-log.component';
import { PropertyUpdateSettingsComponent } from './containers/property-update-settings/property-update-settings.component';
import { PUExportImportQueueAddFiltersService } from 'src/app/services/property-update/filters/pu-export-import-queue-add-filters.service';
import { PUExportImportQueueDefFiltersService } from 'src/app/services/property-update/filters/pu-export-import-queue-def-filters.service';
import { PUExportImportQueueFilterContainerService } from 'src/app/services/property-update/filters/pu-export-import-queue-filter-container.service';
import { PropertyUpdateExportImportQueueComponent } from './components/property-update-export-import-queue/property-update-export-import-queue.component';
import { PropertyUpdateEntityTypesService } from 'src/app/services/property-update/entity/property-update-entity-types.service';

@NgModule({
  declarations: [
    PropertyUpdateExportImportQueueComponent,
    PropertyUpdateLogComponent,
    PropertyUpdateSettingsComponent,
  ],
  entryComponents: [
    PropertyUpdateLogComponent,
    PropertyUpdateSettingsComponent,
  ],
  imports: [
    CommonModule,
    ControlsModule,
    SharedModule,
    CoreModule,

    PropertyUpdateExportImportQueueRoutingModule
  ],
  providers: [
    PUExportImportQueueFilterContainerService,
    PUExportImportQueueDefFiltersService,
    PUExportImportQueueAddFiltersService,
    PropertyUpdateEntityTypesService
  ],
})
export class PropertyUpdateExportImportQueueModule {}
