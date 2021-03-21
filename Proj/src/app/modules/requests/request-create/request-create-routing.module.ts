import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RequestCreateComponent } from './components/request-create/request-create.component';

const routes: Routes = [{
    path: '',
    component: RequestCreateComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestCreateRoutingModule { }
