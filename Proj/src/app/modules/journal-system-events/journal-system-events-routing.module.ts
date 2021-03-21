import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { JournalSystemEventsComponent } from './components/journal-system-events-main/journal-system-events.component';

const routes: Routes = [{
    path: '',
    component: JournalSystemEventsComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JournalSystemEventsRoutingModule { }
