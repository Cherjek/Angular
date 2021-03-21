import { AppLocalization } from 'src/app/common/LocaleRes';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InlineGridComponent } from 'src/app/shared/rom-forms/inline-grid/inline-grid.component';
import { MaximumPowerService } from 'src/app/services/tariff-calculator/maximum-power.service';

const routes: Routes = [
  {
    path: '',
    component: InlineGridComponent,
    data: {
      service: MaximumPowerService,
      columns: [
        {
          Name: 'Code',
          Caption: AppLocalization.Code,
          IsRequired: true,
          MaxLength: 250,
        },
        {
          Name: 'Name',
          Caption: AppLocalization.Name,
          IsRequired: true,
          MaxLength: 250,
        },
      ],
      title: AppLocalization.MaximumCapacity,
      access: { add: 'TC_MAX_POWER_ADD', edit: 'TC_MAX_POWER_EDIT', delete: 'TC_MAX_POWER_DELETE' }
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MaximumPowerRoutingModule {}
