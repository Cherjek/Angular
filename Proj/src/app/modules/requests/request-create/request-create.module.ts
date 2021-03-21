import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ControlsModule } from '../../../controls/ct.module';
import { SharedModule } from '../../../shared/shared.module';
import { CoreModule } from '../../../core/core.module';
import { SharedModule as SharedModuleEx } from '../shared/shared.module';

import { RequestCreateRoutingModule } from './request-create-routing.module';
import { RequestCreateComponent } from './components/request-create/request-create.component';


@NgModule({
    declarations: [RequestCreateComponent],
    imports: [
        CommonModule,
        ControlsModule,
        SharedModule,
        CoreModule,
        
        RequestCreateRoutingModule,
        SharedModuleEx
    ]
})
export class RequestCreateModule { }
