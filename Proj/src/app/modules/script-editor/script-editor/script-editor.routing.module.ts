import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ScriptEditorMainComponent } from './components/script-editor-main/script-editor-main.component';

const routes: Routes = [
  {
    path: '',
    component: ScriptEditorMainComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScriptEditorRoutingModule {}
