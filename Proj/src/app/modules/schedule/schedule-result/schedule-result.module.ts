import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlsModule } from 'src/app/controls/ct.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreModule } from 'src/app/core/core.module';
import { ScheduleResultRoutingModule } from './schedule-result-routing.module';
import { ScheduleResultComponent } from './components/schedule-result/schedule-result.component';
import { ScheduleResultLogComponent } from './components/schedule-result-log/schedule-result-log.component';
import { ScheduleResultStepsComponent } from './components/schedule-result-steps/schedule-result-steps.component';

@NgModule({
  imports: [
    CommonModule,
    ControlsModule,
    SharedModule,
    CoreModule,
    ScheduleResultRoutingModule
  ],
  declarations: [
    ScheduleResultComponent,
    ScheduleResultLogComponent,
    ScheduleResultStepsComponent
  ]
})
export class ScheduleResultModule {}
