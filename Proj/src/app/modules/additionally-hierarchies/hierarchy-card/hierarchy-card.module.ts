import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HierarchyCardComponent } from './components/hierarchy-card.component';
import { PropertyComponent } from './components/property/property.component';
import { StructureComponent } from './components/structure/structure.component';
import { TypeNodesComponent } from './components/type-nodes/type-nodes.component';
import { ControlsModule } from '../../../controls/ct.module';
import { SharedModule } from '../../../shared/shared.module';
import { CoreModule } from '../../../core/core.module';
import { HierarchyCardRoutingModule } from './hierarchy-card-routing.module';
import { SharedHierarchyModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    HierarchyCardComponent,
    PropertyComponent,
    StructureComponent,
    TypeNodesComponent
  ],
  imports: [
    CommonModule,
    ControlsModule,
    SharedModule,
    CoreModule,

    SharedHierarchyModule,
    
    HierarchyCardRoutingModule
  ]
})
export class HierarchyCardModule { }
