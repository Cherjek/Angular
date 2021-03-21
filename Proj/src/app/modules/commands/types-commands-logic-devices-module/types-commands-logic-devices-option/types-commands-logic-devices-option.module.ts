import { NgModule } from '@angular/core';
import { TypesCommandsLogicDevicesOptionRoutingModule } from './types-commands-logic-devices-option-routing.module';
import { TypeLogicDevicesOptionsCardComponent } from './components/options-card/options-card.component';
import { TypeLogicDevicesOptionsPropertyCardComponent } from './components/options-property-card/options-property-card.component';
import { LogicDeviceTypeCommandParameterOptionService } from 'src/app/services/commands/Configuration/logic-device-type-command-parameter-option.service';
import { CommonModule } from '@angular/common';
import { ControlsModule } from 'src/app/controls/ct.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreModule } from 'src/app/core/core.module';
import { SharedHierarchyModule } from '../../../additionally-hierarchies/shared/shared.module';
import { ConfigCommandDeviceTypesService } from 'src/app/services/commands/Configuration/DeviceLogicTypesCommandService.service';

@NgModule({
  imports: [
    CommonModule,
    ControlsModule,
    SharedModule,
    CoreModule,
    SharedHierarchyModule,
    TypesCommandsLogicDevicesOptionRoutingModule
  ],
  exports: [],
  declarations: [
    TypeLogicDevicesOptionsCardComponent,
    TypeLogicDevicesOptionsPropertyCardComponent
  ],
  providers: [
    LogicDeviceTypeCommandParameterOptionService,
    ConfigCommandDeviceTypesService
  ]
})
export class TypesCommandsLogicDevicesOptionModule {}
