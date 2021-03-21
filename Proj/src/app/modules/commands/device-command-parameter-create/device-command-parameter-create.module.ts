import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ControlsModule } from '../../../controls/ct.module';
import { SharedModule } from '../../../shared/shared.module';
import { CoreModule } from '../../../core/core.module';

import { DeviceCommandParameterCreateRoutingModule } from './device-command-parameter-create-routing.module';
import { DeviceTypeParametersComponent } from './components/device-type-parameters/device-type-parameters.component';


@NgModule({
  declarations: [DeviceTypeParametersComponent],
  imports: [
    CommonModule,
    ControlsModule,
    SharedModule,
    CoreModule,
    DeviceCommandParameterCreateRoutingModule
  ]
})
export class DeviceCommandParameterCreateModule { }
