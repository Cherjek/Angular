import { NgModule } from '@angular/core';
import { CommandsTypeLogicDevicesCardComponent } from './components/card/card.component';
import { CommandsTypeLogicDevicesCardPropertiesComponent } from './components/card-properties/card-properties.component';
import { CommonModule } from '@angular/common';
import { ControlsModule } from 'src/app/controls/ct.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreModule } from 'src/app/core/core.module';
import { TypesCommandsLogicDevicesCardRoutingModule } from './types-commands-logic-devices-card-routing.module';
import { SharedHierarchyModule } from '../../../additionally-hierarchies/shared/shared.module';
import { ConfigCommandDeviceTypesService } from 'src/app/services/commands/Configuration/DeviceLogicTypesCommandService.service';
import { CardParametersComponent } from './components/card-parameters/card-parameters.component';
import { TypeDeviceCommandModule } from '../../types-devices-module/type-device-command/type-device-command.module';

@NgModule({
  imports: [
    CommonModule,
    ControlsModule,
    SharedModule,
    CoreModule,
    SharedHierarchyModule,

    TypesCommandsLogicDevicesCardRoutingModule,
    TypeDeviceCommandModule,
  ],
  exports: [],
  declarations: [
    CardParametersComponent,
    CommandsTypeLogicDevicesCardComponent,
    CommandsTypeLogicDevicesCardPropertiesComponent
  ],
  providers: [ConfigCommandDeviceTypesService]
})
export class TypesCommandsLogicDevicesCardModule {}
