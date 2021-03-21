import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ControlsModule } from '../../../controls/ct.module';
import { SharedModule } from '../../../shared/shared.module';
import { CoreModule } from '../../../core/core.module';
import { LDCommandCreateComponent } from './components/create.component';
import { LogicDeviceCommandCreateRoutingModule } from './ld-command-create-routing.module';

@NgModule({
    declarations: [
        LDCommandCreateComponent
    ],
    imports: [
        CommonModule,
        ControlsModule,
        SharedModule,
        CoreModule,

        LogicDeviceCommandCreateRoutingModule
    ]
})
export class LogicDeviceCommandCreateModule { }