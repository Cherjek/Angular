import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit } from '@angular/core';
import { NavigateItem } from '../../../../common/models/Navigate/NavigateItem';

@Component({
  selector: 'rom-access-settings',
  templateUrl: './access-settings.component.html',
  styleUrls: ['./access-settings.component.less']
})
export class AccessSettingsComponent implements OnInit {
  public navigateMenuItems: NavigateItem[] = [
    {
      code: 'list',
      url: 'list',
      name: AppLocalization.List,
      isActive: true,
    },
  ];

  constructor() { }

  ngOnInit() {
  }

}
