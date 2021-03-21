import {Component, OnInit, Input, Output, EventEmitter, HostListener} from '@angular/core';

@Component({
  selector: 'toggle-switch',
  templateUrl: './ToggleSwitch.html',
  styleUrls: ['./ToggleSwitch.css']
})
export class ToggleSwitch implements OnInit {
  @Input() checked: boolean = false;

  @Input() toggleWithSpace: boolean = false;

  @Output() onCheck = new EventEmitter<boolean>();

  @Input() checkedRunnerColorClass: string = 'runner-color-checked-blue';
  @Input() checkedSliderColorClass: string = 'slider-color-checked-blue';

  @Input() uncheckedRunnerColorClass: string = 'runner-color-unchecked';
  @Input() uncheckedSliderColorClass: string = 'slider-color-unchecked';

  constructor() {}

  @HostListener('document:keydown', ['$event'])
    clickWithSpace(event: KeyboardEvent) {
        // console.log(event);
        if (this.toggleWithSpace && event.keyCode == 32) { // Space button
            this.onClick();
        }
    }

  ngOnInit() {}

  onClick() {
    this.checked = !this.checked;
    this.onCheck.emit(this.checked);
  }
}
