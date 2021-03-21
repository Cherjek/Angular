import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlsModule } from '../../../../controls/ct.module';
import { SharedModule } from '../../../../shared/shared.module';
import { CoreModule } from '../../../../core/core.module';

import { TypeDeviceCardRoutingModule } from './type-device-card-routing.module';
import { SharedModule as SharedRequestModule } from '../../../requests/shared/shared.module';
import { SharedHierarchyModule } from 'src/app/modules/additionally-hierarchies/shared/shared.module';

import { RequestCardComponent } from './components/request-card/request-card.component';
import { RequestCardDataqueueComponent } from './components/request-card-dataqueue/request-card-dataqueue.component';
import { RequestCardCommandsComponent } from './components/request-card-commands/request-card-commands.component';
import { RequestCardPropertyComponent } from './components/request-card-property/request-card-property.component';
import { DeviceTypePropertiesComponent } from './components/device-type-properties/device-type-properties.component';

import {
  DataQuerySettingsService,
  DataQueryMainService
} from '../../../../services/data-query';
import { DeviceTypesService } from 'src/app/services/commands/Configuration/device-types.service';
import { DevicePropertyTypeService } from 'src/app/services/configuration/device-property-type.service';

@NgModule({
    declarations: [
        RequestCardComponent, 
        RequestCardDataqueueComponent, 
        RequestCardCommandsComponent, 
        RequestCardPropertyComponent, 
        DeviceTypePropertiesComponent
    ],
    imports: [
        CommonModule,
        ControlsModule,
        SharedModule,
        CoreModule,
        SharedHierarchyModule,

        TypeDeviceCardRoutingModule,
        SharedRequestModule
    ],
    providers: [
        DataQuerySettingsService,
        DataQueryMainService,
        DevicePropertyTypeService,
        DeviceTypesService
    ]
})
export class TypeDeviceCardModule {}
