import { AppLocalization } from 'src/app/common/LocaleRes';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InlineGridComponent } from 'src/app/shared/rom-forms/inline-grid/inline-grid.component';
import { DeviceChannelTypesService } from 'src/app/services/references/device-channel-types.service';

const routes: Routes = [
    {
        path: '',
        component: InlineGridComponent,
        data: {
            service: DeviceChannelTypesService,
            columns: [
              {
                Name: 'Code',
                Caption: AppLocalization.Code,
                IsRequired: true,
                MaxLength: 50
              },
              {
                Name: 'Name',
                Caption: AppLocalization.Name,
                IsRequired: true,
                MaxLength: 250
              }
            ],
            title: AppLocalization.ChannelTypes,
            access: {
              edit: 'REF_EDIT_CHANNELS',
            }
          }
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    declarations: [],
})
export class DeviceChannelTypesRoutingModule { }