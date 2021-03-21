import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { SuppliersMainComponent } from './components/suppliers-main.component';
import { SuppliersChangeComponent } from '../suppliers-card/components/suppliers-change/suppliers-change.component';
import { CanAccessGuard } from 'src/app/core';

const routes: Routes = [
  {  
    path: '',
    component: SuppliersMainComponent
  },
  {
    path: 'change',
    component: SuppliersChangeComponent, 
    data: { access: 'TC_SUPPLIER_REPLACE' },
    canActivate: [CanAccessGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuppliersMainRoutes {};
