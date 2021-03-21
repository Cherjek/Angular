import { TagValueBoundsMainComponent } from './components/tag-value-bounds-main/tag-value-bounds-main.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlsModule } from 'src/app/controls/ct.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreModule } from 'src/app/core/core.module';
import { TagValueBoundsRoutingModule } from './tag-value-bounds.routing.module';
import { TagValueBoundsService } from 'src/app/services/commands/Configuration/tag-value-bounds.service';

@NgModule({
  imports: [
    CommonModule,
    ControlsModule,
    SharedModule,
    CoreModule,

    TagValueBoundsRoutingModule,
  ],
  declarations: [TagValueBoundsMainComponent],
  providers: [TagValueBoundsService],
})
export class TagValueBoundsModule {}
