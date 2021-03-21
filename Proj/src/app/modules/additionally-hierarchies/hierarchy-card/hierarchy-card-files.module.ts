import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlsModule } from '../../../controls/ct.module';
import { SharedModule } from '../../../shared/shared.module';
import { CoreModule } from '../../../core/core.module';
import { EntitiesFileAttachComponent } from '../../entities-file-attach/entities-file-attach.component';

@NgModule({
  declarations: [
    EntitiesFileAttachComponent
  ],
  imports: [
    CommonModule,
    ControlsModule,
    SharedModule,
    CoreModule
  ]
})
export class HierarchyCardFilesModule { }
