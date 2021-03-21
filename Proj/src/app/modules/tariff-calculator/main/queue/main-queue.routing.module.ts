import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanAccessGuard } from 'src/app/core';
import { MainQueueComponent } from './components/main-queue/main-queue.component';

const routes: Routes = [
  {
    path: 'queue',
    component: MainQueueComponent,
    data: { access: 'TC_VIEW_QUEUE' },
    canActivate: [CanAccessGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainQueueRoutingModule {}
