import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ControlsModule } from 'src/app/controls/ct.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreModule } from 'src/app/core/core.module';
import { ScriptEditorMainComponent } from './components/script-editor-main/script-editor-main.component';
import { ScriptEditorRoutingModule } from './script-editor.routing.module';
import { ScriptEditorService } from 'src/app/services/script-editor/script-editor.service';

@NgModule({
  declarations: [ScriptEditorMainComponent],
  imports: [
    CommonModule,
    ControlsModule,
    SharedModule,
    CoreModule,
    ScriptEditorRoutingModule,
  ],
  providers: [ScriptEditorService],
})
export class ScriptEditorModule {}
