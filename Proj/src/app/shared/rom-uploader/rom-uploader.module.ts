import { NgModule } from '@angular/core';
import { RomUploaderComponent } from './components/rom-uploader/rom-uploader.component';
import { ControlsModule } from 'src/app/controls/ct.module';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [CommonModule, ControlsModule],
  exports: [RomUploaderComponent],
  declarations: [RomUploaderComponent]
})
export class RomUploaderModule {}
