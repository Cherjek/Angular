import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PropertyUpdateExportImportCreateComponent } from './components/property-update-export-import-create/property-update-export-import-create.component';

const routes: Routes = [  
  {
    path: '',
    component: PropertyUpdateExportImportCreateComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PropertyUpdateExportImportCreateRoutingModule {}
