import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ControlsModule } from '../../../controls/ct.module';
import { SharedModule } from '../../../shared/shared.module';
import { CoreModule } from '../../../core/core.module';

import { AdditionallyPropertyCardComponent } from './components/additionally-property-card.component';
import { PropertyComponent } from './components/property/property.component';

import { AdditionallyPropertyCardRoutingModule } from './additionally-property-card-routing.module';
import { SharedHierarchyModule } from '../shared/shared.module';

@NgModule({
    declarations: [
        AdditionallyPropertyCardComponent,
        PropertyComponent
    ],
    imports: [
        CommonModule,
        ControlsModule,
        SharedModule,
        CoreModule,

        AdditionallyPropertyCardRoutingModule,
        SharedHierarchyModule
    ]
})
export class AdditionallyPropertyCardModule { }
