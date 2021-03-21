import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccessDirectiveConfig, CanAccessGuard } from '../../../core';
import { NodeCardComponent } from './components/node-card.component';
import { LogicDeviceComponent } from './components/logic-devices/logic-devices.component';
import { PropertyComponent } from './components/property/property.component';
import { CurrentDataComponent } from './components/current-data/current-data.component';
import { EntitiesFileAttachComponent } from '../../entities-file-attach/entities-file-attach.component';

const routes: Routes = [
    {
        path: '',
        component: NodeCardComponent,
        children: [
            { path: '', redirectTo: 'property' },
            { 
                path: 'property', 
                component: PropertyComponent,
                data: { access: ['HH_NODE_VIEW'], noAccessNavigateTo: 'logic-devices' },
                canActivate: [CanAccessGuard]
            },
            { 
                path: 'logic-devices', component: LogicDeviceComponent,
                data: { access: ['HH_NODE_EQUIP_VIEW'] },
                canActivate: [CanAccessGuard]
            },
            { 
                path: 'current-data', component: CurrentDataComponent,
                data: { access: ['OC_VIEW_HIERARCHY_NODE_DATA'] },
                canActivate: [CanAccessGuard]
            },
            {
              path: 'files',
              component: EntitiesFileAttachComponent,
              data: {
                  access: [
                      'HH_NODE_VIEW',
                      // Object.assign(new AccessDirectiveConfig(), {
                      //     source: 'Hierarchies',
                      //     value: 'HH_VIEW_HIERARCHY_NODE_ATTACHMENTS'
                      // })
                  ],
                  entity: 'hierarchy'
              },
              canActivate: [CanAccessGuard]
            }
        ]
    }
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class NodeCardRoutingModule { }