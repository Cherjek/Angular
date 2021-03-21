import { AppLocalization } from 'src/app/common/LocaleRes';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TypesLogicDevicesCardComponent } from './components/types-logic-devices-card/types-logic-devices-card.component';
import { TypesLogicDevicesCardPropertyComponent } from './components/types-logic-devices-card-property/types-logic-devices-card-property.component';
import { InlineGridComponent } from 'src/app/shared/rom-forms/inline-grid/inline-grid.component';
import { LogicDeviceTagGroupsService } from 'src/app/services/references/logic-device-tag-groups.service';
import { TypesLogicDevicesCardTagComponent } from './components/types-logic-devices-card-tag/types-logic-devices-card-tag.component';
import { TypesLogicDevicesCardKindComponent } from './components/types-logic-devices-card-kind/types-logic-devices-card-kind.component';
import { CanAccessGuard } from 'src/app/core';

const routes: Routes = [
  {
    path: '',
    component: TypesLogicDevicesCardComponent,
    children: [
      {
        path: '',
        redirectTo: 'property'
      },
      {
        path: 'property',
        component: TypesLogicDevicesCardPropertyComponent
      },
      {
        path: 'tags',
        component: TypesLogicDevicesCardTagComponent
      },
      {
        path: 'kinds',
        component: TypesLogicDevicesCardKindComponent
      },
      {
        path: 'tag-groups',
        component: InlineGridComponent,
        data: {
          routeId: 'id',
          service: LogicDeviceTagGroupsService,
          columns: [
            {
              Name: 'Name',
              Caption: AppLocalization.Name,
              IsRequired: true,
              MaxLength: 250
            }
          ],
          access: 'CFG_LOGIC_DEVICE_EDIT_TAG_GROUPS'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TypesLogicDevicesCardRoutingModule {}
