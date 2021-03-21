import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlsModule } from '../../../../controls/ct.module';
import { SharedModule } from '../../../../shared/shared.module';
import { CoreModule } from '../../../../core/core.module';

import { TypesDevicesRoutingModule } from './types-devices-routing.module';
import { RequestsMainComponent } from './components/requests-main/requests-main.component';

import { DataQuerySettingsService } from '../../../../services/data-query';

@NgModule({
    declarations: [RequestsMainComponent],
    imports: [
        CommonModule,
        ControlsModule,
        SharedModule,
        CoreModule,

        TypesDevicesRoutingModule
    ],
    providers: [
        DataQuerySettingsService
    ]
})
export class TypesDevicesModule { }
