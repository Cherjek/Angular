import { AppLocalization } from 'src/app/common/LocaleRes';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InlineGridComponent } from 'src/app/shared/rom-forms/inline-grid/inline-grid.component';
import { DataQueryTypesService } from 'src/app/services/references/data-query-types.service';

const routes: Routes = [
  {
    path: '',
    component: InlineGridComponent,
    data: {
      service: DataQueryTypesService,
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
      title: AppLocalization.TypesOfQueries,
      access: 'REF_EDIT_QUERIES'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TypesRequestsRoutingModule {}
