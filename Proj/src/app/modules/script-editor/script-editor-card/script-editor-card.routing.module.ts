import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ScriptEditorCardCheckComponent } from './components/script-editor-card-check/script-editor-card-check.component';
import { ScriptEditorCardPropertyComponent } from './components/script-editor-card-property/script-editor-card-property.component';
import { ScriptEditorCardComponent } from './components/script-editor-card/script-editor-card/script-editor-card.component';

const routes: Routes = [
  {
    path: '',
    component: ScriptEditorCardComponent,
    children: [
      {
        path: '',
        redirectTo: 'property'
      },
      {
        path: 'property',
        component: ScriptEditorCardPropertyComponent
      },
      {
        path: 'check',
        component: ScriptEditorCardCheckComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScriptEditorCardRoutingModule {}
