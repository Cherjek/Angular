import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PaApplicationsCardComponent } from './components/pa-applications-card/pa-applications-card.component';
import { PaApplicationsCardPropertyComponent } from './components/pa-applications-card-property/pa-applications-card-property.component';
import { PaApplicationsCardTypeTagsComponent } from './components/pa-applications-card-type-tags/pa-applications-card-type-tags.component';
import { PaApplicationsCardDocTypesComponent } from './components/pa-applications-card-doc-types/pa-applications-card-doc-types.component';
import { CanAccessGuard } from 'src/app/core';

const routes: Routes = [
  {
    path: '',
    component: PaApplicationsCardComponent,
    children: [
      {
        path: '',
        redirectTo: 'property',
      },
      {
        path: 'property',
        component: PaApplicationsCardPropertyComponent,
        data: { access: 'CPA_VIEW_APP', noAccessNavigateTo: 'types-tags' },
        canActivate: [CanAccessGuard]
      },
      {
        path: 'types-tags',
        component: PaApplicationsCardTypeTagsComponent,
        data: { access: 'CPA_VIEW_APP_TAG_TYPES', noAccessNavigateTo: 'doc-types' },
        canActivate: [CanAccessGuard]
      },
      {
        path: 'doc-types',
        component: PaApplicationsCardDocTypesComponent,
        data: { access: 'CPA_VIEW_APP_DOCUMENT_TYPES' },
        canActivate: [CanAccessGuard]
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaApplicationsCardRoutingModule {}
