import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavigateItem } from '../../../../../common/models/Navigate/NavigateItem';
import {
  ScheduleCardService,
  IScheduleEdit
} from 'src/app/services/schedules.module';
import { Subscription } from 'rxjs';
import { GlobalValues } from 'src/app/core';

@Component({
  selector: 'rom-schedule-card',
  templateUrl: './schedule-card.component.html',
  styleUrls: ['./schedule-card.component.css']
})
export class ScheduleCardComponent implements OnInit, OnDestroy {
  public scheduleTypeName: string;
  private idSchedule: number | string;
  private subscription: Subscription;

  get hierarchyApp() {
    return GlobalValues.Instance.hierarchyApp;
  }
  public get isNew() {
    return this.idSchedule === 'new';
  }
  public menuItems: NavigateItem[] = [
    {
      code: 'properties',
      url: 'properties',
      name: AppLocalization.Properties,
      access: 'SDL_VIEW'
    },
    {
      code: 'trigger',
      url: 'trigger',
      name: AppLocalization.TheTriggerSchedule,
      access: 'SDL_TRIGGER_VIEW'
    },
    {
      code: 'hierarchy',
      url: 'hierarchy',
      name: AppLocalization.HierarchyNodes,
      access: 'SDL_NODES_VIEW'
    },
    {
      code: 'steps',
      url: 'steps',
      name: AppLocalization.ScheduleSteps,
      access: 'SDL_STEPS_VIEW'
    },
    {
      code: 'journal',
      url: 'journal',
      name: AppLocalization.Log,
      access: 'SDL_JOURNAL_VIEW'
    }
  ];

  constructor(
    private activatedRoute: ActivatedRoute,
    private scheduleCardService: ScheduleCardService
  ) {
    this.subscription = this.activatedRoute.parent.params.subscribe(params => {
      this.idSchedule = params.id;
    });
  }

  ngOnInit() {
    this.scheduleCardService
      .getSchedule(this.activatedRoute.snapshot.params.id)
      .subscribe((x: IScheduleEdit) => {
        this.scheduleTypeName = `${x.Name}`;
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
