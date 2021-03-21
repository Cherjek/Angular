import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlsModule } from 'src/app/controls/ct.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreModule } from 'src/app/core/core.module';

import { TestsControlsRoutingModule } from './tests-controls-routing.module';

import { TestPageComponent } from './testPage';
import { TestButtonPageComponent } from './tests-controls/button/buttonPage';
import { EditorsComponent } from './tests-controls/editors/editors.component';
import { ListViewComponent } from './tests-controls/list-view/list-view.component';
import { TreeViewComponent } from './tests-controls/tree-view/tree-view.component';

@NgModule({
  declarations: [
    TestPageComponent,
    TestButtonPageComponent,
    EditorsComponent,
    ListViewComponent,
    TreeViewComponent
  ],
  imports: [
    CommonModule,
    ControlsModule,
    CoreModule,
    SharedModule,
    TestsControlsRoutingModule
  ]
})
export class TestsControlsModule { }
