import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ControlsModule } from '../../../controls/ct.module';
import { SharedModule } from '../../../shared/shared.module';
import { CoreModule } from '../../../core/core.module';

import { CategoryPropertyCardRoutingModule } from './category-property-card-routing.module';

import { CategoryPropertyCardComponent } from './components/category-property-card.component';
import { PropertyComponent } from './components/property/property.component';
import { SharedHierarchyModule } from '../shared/shared.module';

@NgModule({
    declarations: [
        CategoryPropertyCardComponent,
        PropertyComponent
    ],
    imports: [
        CommonModule,
        ControlsModule,
        SharedModule,
        CoreModule,

        CategoryPropertyCardRoutingModule,
        SharedHierarchyModule
    ]
})
export class CategoryPropertyCardModule { }
