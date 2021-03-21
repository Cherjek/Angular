import { AppLocalization } from 'src/app/common/LocaleRes';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReferenceDeviceCommandTypesService } from 'src/app/services/commands/Reference/reference-device-command-types.service';
import { InlineGridComponent } from 'src/app/shared/rom-forms/inline-grid/inline-grid.component';

const routes: Routes = [
  {
    path: '',
    component: InlineGridComponent,
    data: {
      service: ReferenceDeviceCommandTypesService,
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
      title: AppLocalization.DeviceCommandTypes,
      access: 'REF_DEVICE_EDIT_COMMANDS'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  declarations: []
})
export class CommandsTypeDevicesRoutingModule {}
