import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { ControlsModule } from '../../../controls/ct.module';
import { SharedModule } from '../../../shared/shared.module';
import { CoreModule } from '../../../core/core.module';

import { HierarchiesRoutingModule } from './hierarchies-routing.module';
import { HierarchiesComponent } from './components/hierarchies.component';

import { HierarchiesService } from '../../../services/additionally-hierarchies/hierarchies.service';

@NgModule({
    declarations: [
        HierarchiesComponent
    ],
    imports: [
        CommonModule,
        ControlsModule,
        SharedModule,
        CoreModule,

        HierarchiesRoutingModule
    ],
    providers: [
        HierarchiesService
    ]
})
export class HierarchiesModule {
}
