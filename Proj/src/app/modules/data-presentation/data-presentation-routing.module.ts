import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DataPresentationCreateComponent } from './components/data-presentation-create/data-presentation-create.component';

const routes: Routes = [{
    path: '',
    component: DataPresentationCreateComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataPresentationRoutingModule { }
