import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ControlsModule } from '../../../../controls/ct.module';
import { SharedModule } from '../../../../shared/shared.module';
import { CoreModule } from '../../../../core/core.module';

import { SharedHierarchyModule } from '../../../additionally-hierarchies/shared/shared.module';

import { TypeDeviceCommandRoutingModule } from './type-device-command-routing.module';
import { CommandCardComponent } from './components/command-card/command-card.component';
import { PropertyComponent } from './components/property/property.component';
import { ParametersComponent } from './components/parameters/parameters.component';
import { DeviceTypeCommandsService } from 'src/app/services/configuration/device-type-commands.service';
import { LogicDeviceTypeCommandParameterService } from 'src/app/services/commands/Configuration/logic-device-type-command-parameter.service';
import { DataQuerySettingsService } from 'src/app/services/data-query';

@NgModule({
  declarations: [CommandCardComponent, PropertyComponent, ParametersComponent],
  imports: [
    CommonModule,
    ControlsModule,
    SharedModule,
    CoreModule,
    SharedHierarchyModule,
    TypeDeviceCommandRoutingModule
  ],
  exports: [ParametersComponent],
  providers: [
    DeviceTypeCommandsService,
    LogicDeviceTypeCommandParameterService,
    DataQuerySettingsService
  ]
})
export class TypeDeviceCommandModule {}
