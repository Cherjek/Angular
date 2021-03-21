import { AppLocalization } from 'src/app/common/LocaleRes';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InlineGridComponent } from 'src/app/shared/rom-forms/inline-grid/inline-grid.component';
import { TagValueService } from 'src/app/services/references/tag-value.service';
import { CanAccessGuard } from 'src/app/core';

const routes: Routes = [
  {
    path: '',
    component: InlineGridComponent,
    data: {
      service: TagValueService,
      columns: [
        {
          Name: 'Name',
          Caption: AppLocalization.Name,
          IsRequired: true,
          MaxLength: 250,
          routerLink: 'references/filter-card'
        }
      ],
      title: AppLocalization.TaggingFilters,
      access: { add: 'CFG_TAG_FILTERS_ADD', edit: 'CFG_TAG_FILTERS_EDIT', delete: 'CFG_TAG_FILTERS_DELETE' }
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class FilterReferencesRoutingModule {}
