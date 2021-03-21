import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlsModule } from 'src/app/controls/ct.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreModule } from 'src/app/core/core.module';
import { SharedHierarchyModule } from 'src/app/modules/additionally-hierarchies/shared/shared.module';
import { ScriptEditorCardPropertyComponent } from './components/script-editor-card-property/script-editor-card-property.component';
import { ScriptEditorCardComponent } from './components/script-editor-card/script-editor-card/script-editor-card.component';
import { ScriptEditorCardRoutingModule } from './script-editor-card.routing.module';
import { ScriptEditorService } from 'src/app/services/script-editor/script-editor.service';
import { ScriptEditorCardCheckComponent } from './components/script-editor-card-check/script-editor-card-check.component';

@NgModule({
  imports: [
    CommonModule,
    ControlsModule,
    SharedModule,
    CoreModule,
    SharedHierarchyModule,
    ScriptEditorCardRoutingModule,
  ],
  declarations: [
    ScriptEditorCardComponent,
    ScriptEditorCardPropertyComponent,
    ScriptEditorCardCheckComponent,
  ],
  providers: [ScriptEditorService],
})
export class ScriptEditorCardModule {}
