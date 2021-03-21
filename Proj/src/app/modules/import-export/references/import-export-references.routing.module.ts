import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImportReferencesComponent } from './import-references/import-references.component';
import { ExportReferencesComponent } from './export-references/export-references.component';
import { MainImportExportReferencesComponent } from './main-import-export-references/main-import-export-references.component';
import { UploadReferenceComponent } from './upload-reference/upload-reference.component';
import { CanAccessGuard } from 'src/app/core';

const routes: Routes = [
  {
    path: '',
    component: MainImportExportReferencesComponent,
    children: [
      { path: '', redirectTo: 'import' },
      {
        path: 'import',
        component: ImportReferencesComponent,
        data: { access: ['EI_REF_IMPORT'] },
        canActivate: [CanAccessGuard]
      },
      {
        path: 'export',
        component: ExportReferencesComponent,
        data: { access: ['EI_REF_EXPORT'] },
        canActivate: [CanAccessGuard]
      },
      {
        path: 'ref-upload',
        component: UploadReferenceComponent,
        data: { access: ['EI_REF_IMPORT'] },
        canActivate: [CanAccessGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class ImportExportReferencesRoutingModule {}
