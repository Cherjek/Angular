import { AppLocalization } from 'src/app/common/LocaleRes';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InlineGridComponent } from 'src/app/shared/rom-forms/inline-grid/inline-grid.component';
import { LogicDevicePropertyTypesService } from 'src/app/services/references/logic-device-property-types.service';
import { DataQueryMainService } from 'src/app/services/data-query';

const routes: Routes = [
  {
    path: '',
    component: InlineGridComponent,
    data: {
      service: LogicDevicePropertyTypesService,
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
        }
      ],
      title: AppLocalization.TypesOfHardwareProperties,
      access: 'REF_EDIT_LOGIC_DEVICE_PROPERTIES'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LogicDevicePropertyTypesRoutingModule {}
