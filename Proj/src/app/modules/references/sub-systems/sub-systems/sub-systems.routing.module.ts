import { AppLocalization } from 'src/app/common/LocaleRes';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InlineGridComponent } from 'src/app/shared/rom-forms/inline-grid/inline-grid.component';
import { SubSystemsService } from 'src/app/services/references/sub-systems.service';

const routes: Routes = [
  {
    path: '',
    component: InlineGridComponent,
    data: {
      service: SubSystemsService,
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
      title: AppLocalization.Subsystems,
      access: 'REF_EDIT_SUBSYSTEMS'
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubSystemsRoutingModule {}
