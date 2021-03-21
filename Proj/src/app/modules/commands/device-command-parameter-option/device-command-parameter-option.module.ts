import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ControlsModule } from '../../../controls/ct.module';
import { SharedModule } from '../../../shared/shared.module';
import { CoreModule } from '../../../core/core.module';

import { DeviceCommandParameterOptionRoutingModule } from './device-command-parameter-option-routing.module';
import { PropertyComponent } from './components/property/property.component';
import { OptionCardComponent } from './components/option-card/option-card.component';
import { DeviceCommandParameterOptionsService } from 'src/app/services/configuration/device-command-parameter-options.service';
import { DeviceCommandParametersService } from 'src/app/services/configuration/device-command-parameters.service';
import { DeviceTypeCommandParameterOptionService } from 'src/app/services/configuration/device-type-command-parameter-option.service';


@NgModule({
  declarations: [PropertyComponent, OptionCardComponent],
  imports: [
    CommonModule,
    ControlsModule,
    SharedModule,
    CoreModule,
    DeviceCommandParameterOptionRoutingModule
  ],
  providers: [
    DeviceCommandParameterOptionsService,
    DeviceCommandParametersService,
    DeviceTypeCommandParameterOptionService,

  ]
})
export class DeviceCommandParameterOptionModule { }
