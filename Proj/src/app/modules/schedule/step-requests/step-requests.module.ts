import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ControlsModule } from '../../../controls/ct.module';
import { SharedModule } from '../../../shared/shared.module';
import { CoreModule } from '../../../core/core.module';

import { StepRequestsRoutingModule } from './step-requests-routing.module';
import { StepRequestsComponent } from './components/step-requests/step-requests.component';
import { SharedModule as SharedModuleEx } from '../../requests/shared/shared.module';


@NgModule({
  declarations: [StepRequestsComponent],
  imports: [
    CommonModule,

    ControlsModule,
    SharedModule,
    CoreModule,

    StepRequestsRoutingModule,
    SharedModuleEx
  ]
})
export class StepRequestsModule { }
