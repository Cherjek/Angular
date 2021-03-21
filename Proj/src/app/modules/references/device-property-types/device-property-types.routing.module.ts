import { AppLocalization } from 'src/app/common/LocaleRes';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InlineGridComponent } from 'src/app/shared/rom-forms/inline-grid/inline-grid.component';
import { DevicePropertyTypesService } from 'src/app/services/references/device-property-types.service';
import { DataQueryMainService } from 'src/app/services/data-query/data-query-main.service';

const routes: Routes = [
  {
    path: '',
    component: InlineGridComponent,
    data: {
      service: DevicePropertyTypesService,
      subServices: [
        {
          service: DataQueryMainService,
          getMethod: 'getValueTypes',
          columnNames: ['ValueType']
        }
      ],
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
        },
        {
          Name: 'ValueType',
          Caption: AppLocalization.ValueType,
          IsRequired: true,
          Type: 'Option'
        },
        {
          Name: 'NumberDecimalDigits',
          Caption: AppLocalization.CountNumberAfterZ,
          InputType: 'float',
          MaxLength: 10
        }
      ],
      title: AppLocalization.DevicePropertyTypes,
      access: 'REF_EDIT_DEVICE_PROPERTIES'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DevicePropertyTypesRoutingModule {}
