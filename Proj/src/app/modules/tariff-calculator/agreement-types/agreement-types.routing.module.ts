import { AppLocalization } from 'src/app/common/LocaleRes';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InlineGridComponent } from 'src/app/shared/rom-forms/inline-grid/inline-grid.component';
import { AgreementTypesService } from 'src/app/services/tariff-calculator/agreement-types.service';

const routes: Routes = [
  {
    path: '',
    component: InlineGridComponent,
    data: {
      service: AgreementTypesService,
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
      title: AppLocalization.ContractTypes,
      access: { add: 'TC_AGREEMENT_TYPE_ADD', edit: 'TC_AGREEMENT_TYPE_EDIT', delete: 'TC_AGREEMENT_TYPE_DELETE' }
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgreementTypesRoutingModule {}
