import { Component, OnInit, Input } from '@angular/core';
import { IOneTime } from '../models/onetime';

@Component({
  selector: 'rom-settings-onetime',
  templateUrl: './settings-onetime.component.html',
  styleUrls: ['./settings-onetime.component.less']
})
export class SettingsOnetimeComponent implements OnInit {
  startDate: string | Date;
  @Input() isPropEdit = false;
  @Input() data: IOneTime;
  constructor() {}

  ngOnInit() {
    if (this.data) {
      this.startDate = this.data.RunDateTime;
    }
  }
}
