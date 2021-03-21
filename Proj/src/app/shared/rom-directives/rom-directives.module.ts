import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InnerTextFormatDirective } from './inner-text-format.directive';
import { CanAccessDirective } from './can-access.directive';
import { TabTitleDirective } from './tab-title.directive';
import { DragDropDirective } from './drag-drop.directive';
import { HotkeysDirective } from './hotkeys.directive';

@NgModule({
   declarations: [
      InnerTextFormatDirective,
      CanAccessDirective,
      TabTitleDirective,
      DragDropDirective,
      HotkeysDirective
   ],
   imports: [
      CommonModule
   ],
   exports: [
      InnerTextFormatDirective,
      CanAccessDirective,
      TabTitleDirective,
      DragDropDirective,
      HotkeysDirective
   ]
})
export class RomDirectivesModule { }
