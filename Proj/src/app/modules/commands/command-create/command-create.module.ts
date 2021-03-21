import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ControlsModule } from '../../../controls/ct.module';
import { SharedModule } from '../../../shared/shared.module';
import { CoreModule } from '../../../core/core.module';

import { CommandCreateRoutingModule } from './command-create-routing.module';
import { CommandCreateComponent } from './components/command-create/command-create.component';

@NgModule({
    declarations: [CommandCreateComponent],
    imports: [
        CommonModule,
        ControlsModule,
        SharedModule,
        CoreModule,
        
        CommandCreateRoutingModule
    ]
})
export class CommandCreateModule { }
