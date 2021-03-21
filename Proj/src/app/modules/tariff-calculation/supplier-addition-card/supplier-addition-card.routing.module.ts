import { SupplierAdditionCardPropertyComponent } from './components/supplier-addition-card-property/supplier-addition-card-property.component';
import { SupplierAdditionCardMainComponent } from './components/supplier-addition-card-main/supplier-addition-card-main.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SupplierAdditionCardFilesComponent } from './components/supplier-addition-card-files/supplier-addition-card-files.component';

const routes: Routes = [
  {
    path: '',
    component: SupplierAdditionCardMainComponent,
    children: [
      {
        path: '',
        redirectTo: 'property',
      },
      {
        path: 'property',
        component: SupplierAdditionCardPropertyComponent,
      },
      {
        path: 'files',
        component: SupplierAdditionCardFilesComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SupplierAdditionCardRoutingModule {}
