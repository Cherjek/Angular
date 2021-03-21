import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RomAdvertComponent } from './components/rom-advert/rom-advert.component';
import { RomSidebarComponent } from './components/rom-sidebar/rom-sidebar.component';
import { RomPipesModule } from '../rom-pipes/rom-pipes.module';

@NgModule({
  imports: [CommonModule, RomPipesModule],
  declarations: [RomAdvertComponent, RomSidebarComponent],
  exports: [RomAdvertComponent, RomSidebarComponent],
})
export class RomAdvertModule {}
