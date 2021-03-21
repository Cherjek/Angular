import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ControlsModule } from '../../../../controls/ct.module';
import { SharedModule } from '../../../../shared/shared.module';
import { CoreModule } from '../../../../core/core.module';

import { ExportImportQueueRoutingModule } from './export-import-queue-routing.module';
import { ExportImportQueueComponent } from './components/export-import-queue.component';
import { ExportImportCreateComponent } from './components/export-import-create/export-import-create.component';
import { LogComponent } from './containers/log/log.component';
import { SettingsComponent } from './containers/settings/settings.component';

import { ExportImportQueueFilterContainerService } from '../../../../services/taiff-calculation/export-import-queue/Filters/ExportImportQueueFilterContainer.service';
import { ExportImportQueueDefFiltersService } from '../../../../services/taiff-calculation/export-import-queue/Filters/ExportImportQueueDefFilters.service';
import { ExportImportQueueAddFiltersService } from '../../../../services/taiff-calculation/export-import-queue/Filters/ExportImportQueueAddFilters.service';
import { ExportImportService } from '../../../../services/taiff-calculation/export-import-queue/export-import.service';
import { SuppliersService } from 'src/app/services/taiff-calculation/suppliers/suppliers.service';

@NgModule({
  declarations: [ExportImportQueueComponent, ExportImportCreateComponent, LogComponent, SettingsComponent],
  entryComponents: [LogComponent, SettingsComponent],
  imports: [
    CommonModule,
    ControlsModule,
    SharedModule,
    CoreModule,

    ExportImportQueueRoutingModule
  ],
  providers: [
    ExportImportQueueFilterContainerService, 
    ExportImportQueueDefFiltersService, 
    ExportImportQueueAddFiltersService, 
    ExportImportService,
    SuppliersService
  ]
})
export class ExportImportQueueModule { }
