import { AppLocalization } from 'src/app/common/LocaleRes';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InlineGridComponent } from 'src/app/shared/rom-forms/inline-grid/inline-grid.component';
import { PowerLevelService } from 'src/app/services/tariff-calculator/power-levels.service';

const routes: Routes = [
  {
    path: '',
    component: InlineGridComponent,
    data: {
      service: PowerLevelService,
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
      title: AppLocalization.StressLevels,
      access: { add: 'TC_POWER_LEVEL_ADD', edit: 'TC_POWER_LEVEL_EDIT', delete: 'TC_POWER_LEVEL_DELETE' }
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PowerLevelsRoutingModule {}
