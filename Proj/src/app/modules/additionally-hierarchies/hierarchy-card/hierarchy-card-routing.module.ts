import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccessDirectiveConfig, CanAccessGuard } from '../../../core';

import { HierarchyCardComponent } from './components/hierarchy-card.component';

import { PropertyComponent } from './components/property/property.component';
import { TypeNodesComponent } from './components/type-nodes/type-nodes.component';
import { StructureComponent } from './components/structure/structure.component';

const routes: Routes = [
    {
        path: '',
        component: HierarchyCardComponent,
        children: [
            { path: '', redirectTo: 'property' },
            { 
                path: 'property', 
                component: PropertyComponent,
                data: { access: ['HH_VIEW'], noAccessNavigateTo: 'type-nodes' },
                canActivate: [CanAccessGuard]
            },
            { 
                path: 'type-nodes', 
                component: TypeNodesComponent,
                data: { access: ['HH_TYPES_VIEW'], noAccessNavigateTo: 'structure' },
                canActivate: [CanAccessGuard]
            },
            { 
                path: 'structure', 
                component: StructureComponent,
                data: { access: ['HH_NODES_VIEW'] },
                canActivate: [CanAccessGuard]
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HierarchyCardRoutingModule { }
