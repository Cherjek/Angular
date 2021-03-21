import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ControlsModule } from '../../../controls/ct.module';
import { SharedModule } from '../../../shared/shared.module';
import { CoreModule } from '../../../core/core.module';

import { SharedHierarchyModule } from '../../additionally-hierarchies/shared/shared.module';

import { DeviceCommandParameterRoutingModule } from './device-command-parameter-routing.module';
import { PropertyComponent } from './components/property/property.component';
import { ParameterCardComponent } from './components/parameter-card/parameter-card.component';
import { OptionsComponent } from './components/options/options.component';
import { LogicDeviceCommandsService } from 'src/app/services/configuration/logic-device-commands.service';
import { DeviceCommandParametersService } from 'src/app/services/configuration/device-command-parameters.service';
import { LogicDeviceTypeCommandParameterService } from 'src/app/services/commands/Configuration/logic-device-type-command-parameter.service';
import { DeviceCommandParameterOptionsService } from 'src/app/services/configuration/device-command-parameter-options.service';
import { DevicesCommandsService } from 'src/app/services/configuration/devices-commands.service';


@NgModule({
  declarations: [PropertyComponent, ParameterCardComponent, OptionsComponent],
  imports: [
    CommonModule,
    ControlsModule,
    SharedModule,
    CoreModule,
    SharedHierarchyModule,
    DeviceCommandParameterRoutingModule
  ],
  providers: [
    LogicDeviceCommandsService, 
    DeviceCommandParametersService, 
    DevicesCommandsService,
    LogicDeviceTypeCommandParameterService,
    DeviceCommandParameterOptionsService]
})
export class DeviceCommandParameterModule { }
