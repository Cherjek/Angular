import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PropertyTreeComponent } from '../export-import-properties-tree/components/property-tree/property-tree.component';
import { PropertyUpdateExportImportQueueComponent } from './components/property-update-export-import-queue/property-update-export-import-queue.component';

const routes: Routes = [
  {
    path: '',
    component: PropertyUpdateExportImportQueueComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PropertyUpdateExportImportQueueRoutingModule {}
