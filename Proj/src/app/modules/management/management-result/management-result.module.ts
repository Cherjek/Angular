import { NgModule } from '@angular/core';
import { ManagementResultComponent } from './components/management-result/management-result.component';
import { CommonModule } from '@angular/common';
import { ControlsModule } from 'src/app/controls/ct.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreModule } from 'src/app/core/core.module';
import { ManagementResultRoutingModule } from './management-result-routing.module';
import { ManagementResultLogComponent } from './components/management-result-log/management-result-log.component';
import { ManagementResultParametersComponent } from './components/management-result-parameters/management-result-parameters.component';
import { ManagementResultStepsComponent } from './components/management-result-steps/management-result-steps.component';
import { ManagementResultService } from 'src/app/services/managements.module/Result/management-result.service';
import { ManagementResultLogService } from 'src/app/services/managements.module/Result/management-result-log.service';
import { ManagementResultStepsService } from 'src/app/services/managements.module/Result/management-result-steps.service';

@NgModule({
  imports: [
    CommonModule,
    ControlsModule,
    SharedModule,
    CoreModule,

    ManagementResultRoutingModule
  ],
  exports: [],
  declarations: [
    ManagementResultComponent,
    ManagementResultLogComponent,
    ManagementResultParametersComponent,
    ManagementResultStepsComponent
  ],
  providers: [
    ManagementResultService,
    ManagementResultLogService,
    ManagementResultStepsService
  ]
})
export class ManagementResultModule {}
