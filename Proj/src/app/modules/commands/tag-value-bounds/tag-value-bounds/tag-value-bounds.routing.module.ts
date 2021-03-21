import { TagValueBoundsMainComponent } from './components/tag-value-bounds-main/tag-value-bounds-main.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    component: TagValueBoundsMainComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TagValueBoundsRoutingModule {}
