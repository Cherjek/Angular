import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ControlsModule } from '../../../controls/ct.module';
import { SharedModule } from '../../../shared/shared.module';
import { CoreModule } from '../../../core/core.module';

import { NodeCardComponent } from './components/node-card.component';
import { LogicDeviceComponent } from './components/logic-devices/logic-devices.component';
import { PropertyComponent } from './components/property/property.component';
import { SharedHierarchyModule } from '../shared/shared.module';
import { NodeCardRoutingModule } from './node-card-routing.module';
import { CurrentDataComponent } from './components/current-data/current-data.component';
import { HierarchyCardFilesModule } from '../hierarchy-card/hierarchy-card-files.module';

@NgModule({
    declarations: [
        NodeCardComponent,
        LogicDeviceComponent,
        PropertyComponent,
        CurrentDataComponent
    ],
    imports: [
        CommonModule,
        ControlsModule,
        SharedModule,
        CoreModule,
        
        SharedHierarchyModule,

        NodeCardRoutingModule,

        HierarchyCardFilesModule
    ],
    entryComponents: [PropertyComponent]
})
export class NodeCardModule { }