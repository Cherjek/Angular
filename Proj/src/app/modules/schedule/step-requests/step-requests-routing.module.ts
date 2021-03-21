import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StepRequestsComponent } from './components/step-requests/step-requests.component';


const routes: Routes = [{
    path: '',
    component: StepRequestsComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StepRequestsRoutingModule { }
