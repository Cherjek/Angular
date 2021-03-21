import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlsModule } from 'src/app/controls/ct.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreModule } from 'src/app/core/core.module';
import { SharedHierarchyModule } from '../../../additionally-hierarchies/shared/shared.module';
import { TypeLogicDevicesParameterComponent } from './components/parameter/parameter.component';
import { TypeLogicDevicesPropertyComponent } from './components/property/property.component';
import { TypesCommandsLogicDevicesParameterRoutingModule } from './types-commands-logic-devices-parameter-routing.module';
import { LogicDeviceTypeCommandParameterService } from 'src/app/services/commands/Configuration/logic-device-type-command-parameter.service';
import { DataQueryMainService } from 'src/app/services/data-query/data-query-main.service';
import { TypeLogicDevicesParameterOptionsComponent } from './components/options/options.component';
import { LogicDeviceTypeCommandParameterOptionService } from 'src/app/services/commands/Configuration/logic-device-type-command-parameter-option.service';
import { ConfigCommandDeviceTypesService } from 'src/app/services/commands/Configuration/DeviceLogicTypesCommandService.service';

@NgModule({
  imports: [
    CommonModule,
    ControlsModule,
    SharedModule,
    CoreModule,
    SharedHierarchyModule,

    TypesCommandsLogicDevicesParameterRoutingModule
  ],
  exports: [],
  declarations: [
    TypeLogicDevicesParameterComponent,
    TypeLogicDevicesPropertyComponent,
    TypeLogicDevicesParameterOptionsComponent
  ],
  providers: [
    LogicDeviceTypeCommandParameterService,
    ConfigCommandDeviceTypesService,
    LogicDeviceTypeCommandParameterOptionService,
    DataQueryMainService
  ]
})
export class TypesCommandsLogicDevicesParameterModule {}
