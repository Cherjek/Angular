import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NavigateItem } from 'src/app/common/models/Navigate/NavigateItem';

@Component({
  selector: 'rom-schedule-result',
  templateUrl: './schedule-result.component.html',
  styleUrls: ['./schedule-result.component.css']
})
export class ScheduleResultComponent implements OnInit, OnDestroy {
  public errorsContentValidationForms: any[] = [];
  public menuItems: NavigateItem[];
  subscription$: any;
  journalId: number;

  constructor(private router: Router) {
    this.accessTabMenu();
  }

  ngOnInit() {}

  ngOnDestroy() {}

  private accessTabMenu() {
    this.menuItems = [
      {
        code: 'log',
        url: 'log',
        name: AppLocalization.Log
      },
      {
        code: 'steps',
        url: 'steps',
        name: AppLocalization.Stages
      }
    ];
  }
}
