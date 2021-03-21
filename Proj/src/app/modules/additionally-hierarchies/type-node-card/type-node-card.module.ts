import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ControlsModule } from '../../../controls/ct.module';
import { SharedModule } from '../../../shared/shared.module';
import { CoreModule } from '../../../core/core.module';

import { TypeNodeCardRoutingModule } from './type-node-card-routing.module';
import { TypeNodeCardComponent } from './components/type-node-card.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { AddPropertiesComponent } from './components/add-properties/add-properties.component';
import { PropertyComponent } from './components/property/property.component';
import { SharedHierarchyModule } from '../shared/shared.module';

@NgModule({
    declarations: [
        TypeNodeCardComponent,
        AddPropertiesComponent,
        CategoriesComponent,
        PropertyComponent, 
    ],
    imports: [
        CommonModule,
        ControlsModule,
        SharedModule,
        CoreModule,

        TypeNodeCardRoutingModule,
        SharedHierarchyModule
    ]
})
export class TypeNodeCardModule { }
