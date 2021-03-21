import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  IScheduleEdit,
  ScheduleCardService,
  Schedule
} from 'src/app/services/schedules.module';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { IEntityViewProperty } from 'src/app/services/common/Interfaces/IEntityViewProperty';

@Component({
  selector: 'rom-schedule-card-properties',
  templateUrl: './schedule-card-properties.component.html',
  styleUrls: ['./schedule-card-properties.component.css']
})
export class ScheduleCardPropertiesComponent implements OnInit, OnDestroy {
  public loadingContent: boolean;
  public errors: any[] = [];
  public errorLoadEntity: any;
  
  private idSchedule: number | string;
  private subscription$: Subscription;
  private userGroup$: Subscription;
  private schedule$: Subscription;

  public properties: IEntityViewProperty[];
  public get isNew() {
    return this.idSchedule === 'new';
  }
  constructor(
    private scheduleCardService: ScheduleCardService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.subscription$ = this.activatedRoute.parent.params.subscribe(params => {
      this.idSchedule = params.id;
    });
  }

  ngOnInit() {
    this.loadSchedule();
    this.loadUserGroups();
  }

  addNewSchedule() {}

  ngOnDestroy() {
    this.unsubscriber(this.subscription$);
    this.unsubscriber(this.userGroup$);
    this.unsubscriber(this.schedule$);
  }

  private loadSchedule() {
    this.loadingContent = true;
    this.schedule$ = this.scheduleCardService
      .get(this.idSchedule)
      .pipe(
        finalize(() => {
          this.loadingContent = false;
        })
      )
      .subscribe(
        (data: IScheduleEdit) => {
          this.initProperties(data);
        },
        (error: any) => {
          this.errorLoadEntity = error;
        }
      );
  }

  private initProperties(schedule: IScheduleEdit) {
    this.properties = [
        {
            Code: 'Name',
            Name: AppLocalization.ScheduleName,
            Type: 'String',
            Value: schedule.Name,
            IsRequired: true
        },
        {
            Code: 'UserGroup',
            Name: AppLocalization.Group,
            Type: 'Option',
            Value: schedule.UserGroup,
            IsRequired: true
        },
        {
            Code: 'Description',
            Name: AppLocalization.Description,
            Type: 'MultiString',
            Value: schedule.Description
        }
    ];
  }

  optionControlDropDown(event: any) {
    const property = event.property;
    this.userGroup$ = this.loadUserGroups().subscribe(
      (groups: any) => {
        property.arrayValues = groups;
      },
      (error: any) => (this.errors = [error])
    );
  }

  public save(properties: IEntityViewProperty[], propControl: any) {
    this.errors = [];
    const schedule = new Schedule();
    if (!this.isNew) {
      schedule.Id = this.idSchedule as number;
    }
    properties.forEach((prop: IEntityViewProperty) => {
      schedule[prop.Code] = prop.Value;
    });
    if (!schedule.UserGroup) {
      this.errors = [`${AppLocalization.NeedSet} "${AppLocalization.Group}"`];
      return;
    }
    this.loadingContent = true;
    this.scheduleCardService
      .postSchedule(schedule)
      .then((idSchedule: number) => {
        this.loadingContent = false;

        if (this.isNew) {
          this.router.navigate(['../../../schedule-card/' + idSchedule], {
            relativeTo: this.activatedRoute
          });
        } else {
          this.loadSchedule();
        }

        propControl.cancelChangeProperty();
      })
      .catch((error: any) => {
        this.loadingContent = false;
        this.errors = [error];
      });
  }

  private loadUserGroups() {
    if (this.scheduleCardService.userGroupsCache) {
      return this.scheduleCardService.userGroupsCache;
    } else {
      this.scheduleCardService.userGroupsCache = this.scheduleCardService.getUserGroups();
      return this.scheduleCardService.userGroupsCache;
    }
  }

  private unsubscriber(subscription: Subscription) {
    if (subscription) {
      subscription.unsubscribe();
    }
  }
}
