import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EntitiesBasketComponent } from './components/entities-basket/entities-basket.component';
// import { UnitsTreeComponent } from './components/export-import-units-tree';

const routes: Routes = [
  {
    path: '',
    component: EntitiesBasketComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExportImportUnitsTreeRoutingModule {}
