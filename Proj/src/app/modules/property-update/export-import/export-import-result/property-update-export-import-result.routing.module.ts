import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { PropertyUpdateExportImportResultLogComponent } from './components/property-update-export-import-result-log/property-update-export-import-result-log.component';
import { PropertyUpdateExportImportResultComponent } from './components/property-update-export-import-result/property-update-export-import-result.component';
import { PropertyUpdateExportImportResultParametersComponent } from './components/property-update-export-import-result-parameters/property-update-export-import-result-parameters.component';
import { CanAccessGuard } from 'src/app/core';
import { PropertyUpdateExportImportResultParametersNewComponent } from './components/property-update-export-import-result-parameters-new/property-update-export-import-result-parameters-new.component';

const routes: Routes = [
  {
    path: '',
    component: PropertyUpdateExportImportResultComponent,
    children: [
      {
        path: '',
        redirectTo: 'parameters',
      },
      // {
      //   path: 'parameters',
      //   component: PropertyUpdateExportImportResultParametersComponent,
      // },
      {
        path: 'parameters',
        component: PropertyUpdateExportImportResultParametersNewComponent,
      },
      {
        path: 'log',
        component: PropertyUpdateExportImportResultLogComponent,
        data: { access: 'CMG_EXPORT_IMPORT_VIEW_LOG' },
        canActivate: [CanAccessGuard]
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PropertyUpdateExportImportResultRoutingModule {}
