import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlsModule } from 'src/app/controls/ct.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreModule } from 'src/app/core/core.module';
import { ExportImportResultLogComponent } from './components/export-import-result-log/export-import-result-log.component';
import { ExportImportResultParametersComponent } from './components/export-import-result-parameters/export-import-result-parameters.component';
import { ExportImportResultComponent } from './components/export-import-result/export-import-result.component';
import { ExportImportResultRoutingModule } from './export-import-result.routing.module';
import { ExportImportService } from 'src/app/services/taiff-calculation/export-import-queue/export-import.service';

@NgModule({
  imports: [
    CommonModule,
    ControlsModule,
    SharedModule,
    CoreModule,

    ExportImportResultRoutingModule,
  ],
  declarations: [
    ExportImportResultComponent,
    ExportImportResultLogComponent,
    ExportImportResultParametersComponent,
  ],
  providers: [ExportImportService],
})
export class ExportImportResultModule {}
