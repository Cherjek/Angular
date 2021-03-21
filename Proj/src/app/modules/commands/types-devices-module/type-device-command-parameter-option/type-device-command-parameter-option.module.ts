import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TypeDeviceCommandParameterOptionRoutingModule } from './type-device-command-parameter-option-routing.module';
import { OptionsCardComponent } from './components/options-card/options-card.component';
import { OptionsPropertyCardComponent } from './components/options-property-card/options-property-card.component';
import { ControlsModule } from 'src/app/controls/ct.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreModule } from 'src/app/core/core.module';
import { SharedHierarchyModule } from '../../../additionally-hierarchies/shared/shared.module';
import { DeviceTypeCommandParameterOptionService } from 'src/app/services/configuration/device-type-command-parameter-option.service';
import { DeviceTypeCommandsService } from 'src/app/services/configuration/device-type-commands.service';
import { DataQuerySettingsService } from 'src/app/services/data-query';
import { DeviceTypeCommandParameterService } from 'src/app/services/configuration/device-type-command-parameter.service';

@NgModule({
  declarations: [OptionsCardComponent, OptionsPropertyCardComponent],
  imports: [
    CommonModule,
    ControlsModule,
    SharedModule,
    CoreModule,
    SharedHierarchyModule,
    TypeDeviceCommandParameterOptionRoutingModule
  ],
  providers: [
    DeviceTypeCommandParameterOptionService,
    DeviceTypeCommandsService,
    DataQuerySettingsService,
    DeviceTypeCommandParameterService
  ]
})
export class TypeDeviceCommandParameterOptionModule {}
