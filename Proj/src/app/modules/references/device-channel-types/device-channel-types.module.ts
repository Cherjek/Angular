import { NgModule } from '@angular/core';
import { DeviceChannelTypesRoutingModule } from './device-channel-types-routing.module';
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
    DeviceChannelTypesRoutingModule
  ]
})
export class DeviceChannelTypesModule {}
