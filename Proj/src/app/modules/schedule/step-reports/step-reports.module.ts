import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ControlsModule } from '../../../controls/ct.module';
import { SharedModule } from '../../../shared/shared.module';
import { CoreModule } from '../../../core/core.module';

import { StepReportsRoutingModule } from './step-reports-routing.module';
import { StepReportsComponent } from './components/step-reports/step-reports.component';


@NgModule({
  declarations: [StepReportsComponent],
  imports: [
    CommonModule,
    StepReportsRoutingModule,

    ControlsModule,
    SharedModule,
    CoreModule
  ]
})
export class StepReportsModule { }
