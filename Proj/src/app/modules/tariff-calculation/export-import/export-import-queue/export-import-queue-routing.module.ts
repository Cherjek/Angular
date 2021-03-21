import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccessDirectiveConfig, CanAccessGuard } from 'src/app/core';
import { ExportImportCreateComponent } from './components/export-import-create/export-import-create.component';
import { ExportImportQueueComponent } from './components/export-import-queue.component';

const routes: Routes = [{
    path: 'queue',
    component: ExportImportQueueComponent,
    data: { access:'TC_EXPORT_IMPORT_VIEW_QUEUE' },
    canActivate: [CanAccessGuard]
}, {
  path: 'create/:type',
  component: ExportImportCreateComponent,
  data: {  
    access: Object.assign(new AccessDirectiveConfig(), {
      arrayOperator: 'Or',
      value: ['TC_EXPORT_START', 'TC_IMPORT_START']
    })
  },
  canActivate: [CanAccessGuard]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExportImportQueueRoutingModule { }
