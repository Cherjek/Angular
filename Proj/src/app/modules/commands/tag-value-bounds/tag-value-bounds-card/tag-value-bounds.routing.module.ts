import { TagValueBoundsCardLogicDevicesComponent } from './components/tag-value-bounds-card-logic-devices/tag-value-bounds-card-logic-devices.component';
import { TagValueBoundsCardPropertyComponent } from './components/tag-value-bounds-card-property/tag-value-bounds-card-property.component';
import { TagValueBoundsCardComponent } from './components/tag-value-bounds-card/tag-value-bounds-card.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CanAccessGuard } from 'src/app/core';

const routes: Routes = [
  {
    path: '',
    component: TagValueBoundsCardComponent,
    children: [
      {
        path: '',
        redirectTo: 'property',
      },
      {
        path: 'property',
        component: TagValueBoundsCardPropertyComponent,
      },
      {
        path: 'logic-types',
        component: TagValueBoundsCardLogicDevicesComponent,
        data: { access: ['REF_VIEW_LOGIC_DEVICE_TAGS','CFG_TAG_BOUNDS_TAGS_VIEW'] },
        canActivate: [CanAccessGuard]
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TagValueBoundsCardRoutingModule {}
