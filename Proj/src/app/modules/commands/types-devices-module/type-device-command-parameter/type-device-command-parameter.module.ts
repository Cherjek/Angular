import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ControlsModule } from '../../../../controls/ct.module';
import { SharedModule } from '../../../../shared/shared.module';
import { CoreModule } from '../../../../core/core.module';

import { TypeDeviceCommandParameterRoutingModule } from './type-device-command-parameter-routing.module';
import { ParameterComponent } from './components/parameter/parameter.component';
import { ParameterPropertyComponent } from './components/parameter-property/parameter-property.component';
import { ParameterOptionsComponent } from './components/parameter-options/parameter-options.component';
import { SharedHierarchyModule } from '../../../additionally-hierarchies/shared/shared.module';
import { DeviceTypeCommandParameterService } from 'src/app/services/configuration/device-type-command-parameter.service';
import { DataQueryMainService } from 'src/app/services/data-query/data-query-main.service';
import { DeviceTypeCommandParameterOptionService } from 'src/app/services/configuration/device-type-command-parameter-option.service';
import { DataQuerySettingsService } from 'src/app/services/data-query';
import { DeviceTypeCommandsService } from 'src/app/services/configuration/device-type-commands.service';

@NgModule({
  declarations: [
    ParameterComponent,
    ParameterPropertyComponent,
    ParameterOptionsComponent
  ],
  imports: [
    CommonModule,
    ControlsModule,
    SharedModule,
    CoreModule,
    SharedHierarchyModule,
    TypeDeviceCommandParameterRoutingModule
  ],
  providers: [
    DeviceTypeCommandParameterService,
    DataQueryMainService,
    DataQuerySettingsService,
    DeviceTypeCommandsService,
    DeviceTypeCommandParameterOptionService
  ]
})
export class TypeDeviceCommandParameterModule {}
