import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RequestsQueueComponent } from './components/requests-queue/requests-queue.component';


const routes: Routes = [
  {
    path: '', component: RequestsQueueComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestsQueueRoutingModule { }
