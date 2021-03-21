import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ControlsModule } from '../../../controls/ct.module';
import { SharedModule } from '../../../shared/shared.module';
import { CoreModule } from '../../../core/core.module';
import { NodeCreateComponent } from './components/node-create.component';
import { NodeCreateRoutingModule } from './node-create-routing.module';

@NgModule({
    declarations: [
        NodeCreateComponent
    ],
    imports: [
        CommonModule,
        ControlsModule,
        SharedModule,
        CoreModule,

        NodeCreateRoutingModule
    ]
})
export class NodeCreateModule { }