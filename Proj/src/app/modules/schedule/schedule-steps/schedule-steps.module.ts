import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ControlsModule } from 'src/app/controls/ct.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreModule } from 'src/app/core/core.module';

import { ScheduleStepsRoutingModule } from './schedule-steps-routing.module';
import { ScheduleStepsComponent } from './components/schedule-steps/schedule-steps.component';
import { ScheduleStepService } from 'src/app/services/schedules.module';


@NgModule({
  declarations: [ScheduleStepsComponent],
  imports: [
    CommonModule,
    ControlsModule,
    SharedModule,
    CoreModule,
    ScheduleStepsRoutingModule
  ],
  providers: [ScheduleStepService]
})
export class ScheduleStepsModule { }
