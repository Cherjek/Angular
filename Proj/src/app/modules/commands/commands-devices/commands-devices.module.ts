import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ControlsModule } from '../../../controls/ct.module';
import { SharedModule } from '../../../shared/shared.module';
import { CoreModule } from '../../../core/core.module';

import { SharedHierarchyModule } from '../../additionally-hierarchies/shared/shared.module';

import { CommandsDevicesRoutingModule } from './commands-devices-routing.module';
import { CommandCardComponent } from './components/command-card/command-card.component';
import { PropertyComponent } from './components/property/property.component';
import { ParametersComponent } from './components/parameters/parameters.component';
import { DeviceCommandParametersService } from 'src/app/services/configuration/device-command-parameters.service';
import { LogicDeviceCommandsService } from 'src/app/services/configuration/logic-device-commands.service';


@NgModule({
  declarations: [CommandCardComponent, PropertyComponent, ParametersComponent],
  imports: [
    CommonModule,
    ControlsModule,
    SharedModule,
    CoreModule,
    SharedHierarchyModule,
    CommandsDevicesRoutingModule
  ],
  providers: [DeviceCommandParametersService, LogicDeviceCommandsService]
})
export class CommandsDevicesModule { }
