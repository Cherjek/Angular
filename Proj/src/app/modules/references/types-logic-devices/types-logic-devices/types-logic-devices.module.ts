import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlsModule } from 'src/app/controls/ct.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreModule } from 'src/app/core/core.module';
import { TypesLogicDevicesRoutingModule } from './types-logic-devices.routing.module';
import { TypesLogicDevicesMainComponent } from './components/types-logic-devices-main/types-logic-devices-main.component';
import { LogicDeviceTypesService } from 'src/app/services/configuration/logic-device-types.service';

@NgModule({
  imports: [
    CommonModule,
    ControlsModule,
    SharedModule,
    CoreModule,

    TypesLogicDevicesRoutingModule
  ],
  declarations: [TypesLogicDevicesMainComponent],
  providers: [LogicDeviceTypesService]
})
export class TypesLogicDevicesModule {}
