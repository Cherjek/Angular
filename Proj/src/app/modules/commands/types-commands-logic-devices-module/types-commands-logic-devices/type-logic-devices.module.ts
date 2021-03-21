import { NgModule } from '@angular/core';

import { CommandsTypeLogicDevicesMainComponent } from './components/main/main.component';
import { TypesCommandsLogicDevicesRoutingModule } from './type-logic-devices-routing.module';
import { ConfigCommandDeviceTypesService } from 'src/app/services/commands/Configuration/DeviceLogicTypesCommandService.service';
import { CommonModule } from '@angular/common';
import { ControlsModule } from 'src/app/controls/ct.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreModule } from 'src/app/core/core.module';

@NgModule({
  imports: [
    CommonModule,
    ControlsModule,
    SharedModule,
    CoreModule,

    TypesCommandsLogicDevicesRoutingModule
  ],
  exports: [],
  declarations: [CommandsTypeLogicDevicesMainComponent],
  providers: [ConfigCommandDeviceTypesService]
})
export class TypesCommandsLogicDevicesModule {}
