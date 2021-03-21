import { ExportImportResultLogComponent } from './components/export-import-result-log/export-import-result-log.component';
import { ExportImportResultParametersComponent } from './components/export-import-result-parameters/export-import-result-parameters.component';
import { ExportImportResultComponent } from './components/export-import-result/export-import-result.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CanAccessGuard } from 'src/app/core';

const routes: Routes = [
  {
    path: '',
    component: ExportImportResultComponent,
    children: [
      {
        path: '',
        redirectTo: 'parameters',
      },
      {
        path: 'parameters',
        component: ExportImportResultParametersComponent,
      },
      {
        path: 'log',
        component: ExportImportResultLogComponent,
        data: { access: 'TC_EXPORT_IMPORT_VIEW_LOG' },
        canActivate: [CanAccessGuard]
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExportImportResultRoutingModule {}
