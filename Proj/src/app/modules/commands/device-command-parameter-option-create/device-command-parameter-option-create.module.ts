import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ControlsModule } from '../../../controls/ct.module';
import { SharedModule } from '../../../shared/shared.module';
import { CoreModule } from '../../../core/core.module';

import { DeviceCommandParameterOptionCreateRoutingModule } from './device-command-parameter-option-create-routing.module';
import { OptionsComponent } from './components/options/options.component';
import { DeviceCommandParametersService } from 'src/app/services/configuration/device-command-parameters.service';
import { LogicDeviceTypeCommandParameterOptionService } 
    from 'src/app/services/commands/Configuration/logic-device-type-command-parameter-option.service';
import { DeviceCommandParameterOptionsService } from 'src/app/services/configuration/device-command-parameter-options.service';


@NgModule({
  declarations: [OptionsComponent],
  imports: [
    CommonModule,
    ControlsModule,
    SharedModule,
    CoreModule,
    DeviceCommandParameterOptionCreateRoutingModule
  ],
  providers: [LogicDeviceTypeCommandParameterOptionService, 
    DeviceCommandParametersService,
    DeviceCommandParameterOptionsService]
})
export class DeviceCommandParameterOptionCreateModule { }
