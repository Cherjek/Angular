import {
  Directive,
  HostListener,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';

@Directive({
  selector: '[romHotkeys]',
})
export class HotkeysDirective {
  @Output() onCtrlSave = new EventEmitter();
  @Output() onEsc = new EventEmitter();
  @Input() editMode: boolean;
  constructor() {}

  @HostListener('document:keydown', ['$event']) onKeyboardPress(
    event: KeyboardEvent
  ) {
    if (!this.editMode) {
      return;
    }
    if (event.ctrlKey) {
      if (event.keyCode === 83) {
        event.preventDefault();
        this.onCtrlSave.emit('save');
      }
    } else {
      if (event.keyCode === 27) {
        this.onEsc.emit('cancel');
      }
    }
  }
}
