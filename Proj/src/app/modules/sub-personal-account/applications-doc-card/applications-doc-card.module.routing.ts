import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppLocalization } from 'src/app/common/LocaleRes';
import { PaDocTypeStatusService } from 'src/app/services/sub-personal-account/pa-doc-type-status.service';
import { InlineGridComponent } from 'src/app/shared/rom-forms/inline-grid/inline-grid.component';
import { IInlineGridRouteData } from 'src/app/shared/rom-forms/inline-grid/models/InlineGridDataColumn';
import { AppDocTypeCardPropertyComponent } from './components/app-doc-type-card-property/app-doc-type-card-property.component';
import { AppDocTypeCardComponent } from './components/app-doc-type-card/app-doc-type-card.component';

const routes: Routes = [
  {
    path: '',
    component: AppDocTypeCardComponent,
    children: [
      {
        path: '',
        redirectTo: 'property',
      },
      {
        path: 'property',
        component: AppDocTypeCardPropertyComponent,
      },
      {
        path: 'statuses',
        component: InlineGridComponent,
        data: {
          access: { 
            add: 'CPA_EDIT_APP_DOCUMENT_STATUS_TYPES', 
            edit: 'CPA_EDIT_APP_DOCUMENT_STATUS_TYPES', 
            delete: 'CPA_EDIT_APP_DOCUMENT_STATUS_TYPES' 
          },
          service: PaDocTypeStatusService,
          columns: [
            {
              Name: 'Name',
              Caption: AppLocalization.Name,
              IsRequired: true,
              MaxLength: 125,
            },
            {
              Name: 'Code',
              Caption: AppLocalization.Code,
              IsRequired: true,
              MaxLength: 125,
            },
          ],
        } as IInlineGridRouteData,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppDocTypeCardRoutingModule {}
