import { NgModule } from '@angular/core';
import { CommandsTypeDevicesMainComponent } from './components/main/main.component';
import { CommonModule } from '@angular/common';
import { ControlsModule } from 'src/app/controls/ct.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreModule } from 'src/app/core/core.module';
import { CommandsTypeDevicesRoutingModule } from './type-devices-routing.module';
import { ReferenceDeviceCommandTypesService } from 'src/app/services/commands/Reference/reference-device-command-types.service';

@NgModule({
  imports: [
    CommonModule,
    ControlsModule,
    SharedModule,
    CoreModule,

    CommandsTypeDevicesRoutingModule
  ],
  exports: [],
  declarations: [CommandsTypeDevicesMainComponent],
  providers: [ReferenceDeviceCommandTypesService]
})
export class CommandsTypeDevicesModule {}
