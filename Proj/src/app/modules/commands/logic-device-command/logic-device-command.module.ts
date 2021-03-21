import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ControlsModule } from '../../../controls/ct.module';
import { SharedModule } from '../../../shared/shared.module';
import { CoreModule } from '../../../core/core.module';

import { SharedHierarchyModule } from '../../additionally-hierarchies/shared/shared.module';

import { LogicDeviceCommandRoutingModule } from './logic-device-command-routing.module';

import { LogicDeviceCommandComponent } from './components/ld-command-card/ld-command-card.component';
import { PropertyComponent } from './components/property/property.component';
import { DevicesCommandsComponent } from './components/devices-commands/devices-commands.component';


@NgModule({
  declarations: [LogicDeviceCommandComponent, PropertyComponent, DevicesCommandsComponent],
  imports: [
    CommonModule,
    ControlsModule,
    SharedModule,
    CoreModule,
    LogicDeviceCommandRoutingModule,
    SharedHierarchyModule
  ]
})
export class LogicDeviceCommandModule { }
