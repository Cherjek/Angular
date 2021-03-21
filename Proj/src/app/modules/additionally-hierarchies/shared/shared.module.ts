import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ControlsModule } from '../../../controls/ct.module';
import { SharedModule } from '../../../shared/shared.module';
import { CoreModule } from '../../../core/core.module';

import { SharedPropertyComponent } from './property/property.component';

@NgModule({
    declarations: [
        SharedPropertyComponent
    ],
    exports: [
        SharedPropertyComponent
    ],
    imports: [
        CommonModule,
        ControlsModule,
        SharedModule,
        CoreModule
    ]
})
export class SharedHierarchyModule { }