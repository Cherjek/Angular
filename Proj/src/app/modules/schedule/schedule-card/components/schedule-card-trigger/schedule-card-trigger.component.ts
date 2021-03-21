import { AppLocalization } from 'src/app/common/LocaleRes';
import {
  Component,
  OnInit,
  OnDestroy,
  HostListener,
  ViewChildren,
  QueryList
} from '@angular/core';
import { IEntityViewProperty } from 'src/app/services/common/Interfaces/IEntityViewProperty';
import { ActivatedRoute } from '@angular/router';
import { Subscription, of } from 'rxjs';
import { ScheduleTriggerService } from 'src/app/services/schedules.module';
import { finalize } from 'rxjs/operators';
import { IData } from 'src/app/services/data-query';
import { IScheduleSettings } from '../../containers/models/schedule-settings';
import { mapFactory } from '../../containers/models/map-factory';
import { IMonthly } from '../../containers/models/monthly';
import { IOneTime } from '../../containers/models/onetime';
import { IDaily } from '../../containers/models/daily';
import { IWeekly } from '../../containers/models/weekly';

@Component({
  selector: 'rom-schedule-card-trigger',
  templateUrl: './schedule-card-trigger.component.html',
  styleUrls: ['./schedule-card-trigger.component.less']
})
export class ScheduleCardTriggerComponent implements OnInit, OnDestroy {
  public loadingContent: boolean;
  public errors: any[] = [];
  public errorLoadEntity: any;
  public properties: IEntityViewProperty[];
  active: boolean;
  useDateBounds: boolean;
  startDate: string | Date;
  endDate: string | Date;
  data: IScheduleSettings;
  subscription: Subscription;
  idSchedule: number;
  isPropEdit = false;
  selectedValue = '';
  @ViewChildren('childComp') childComp: QueryList<any>;
  private _componentCode: any;
  typeValues: IData[];
  postSetting$: Subscription;
  getSetting$: Subscription;
  getTypes$: Subscription;

  @HostListener('document:keydown', ['$event']) onKeyDownFilter(
    event: KeyboardEvent
  ) {
    if (event.ctrlKey) {
      // Ctrl + s = save
      if (event.keyCode === 83) {
        event.preventDefault();
        this.save();
      }
    } else {
      // Esc = cancel
      if (event.keyCode === 27) {
        this.cancel();
      }
    }
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private triggerService: ScheduleTriggerService
  ) {
    this.subscription = this.activatedRoute.parent.params.subscribe(params => {
      this.idSchedule = params.id;
    });
  }

  get componentCode() {
    return this._componentCode;
  }

  set componentCode(value) {
    if (value) {
      this._componentCode = value;
    }
  }

  ngOnInit() {
    this.loadTrigger();
  }

  ngOnDestroy() {
    this.unsubscriber(this.subscription);
    this.unsubscriber(this.postSetting$);
    this.unsubscriber(this.getSetting$);
    this.unsubscriber(this.getTypes$);
  }

  private loadTrigger() {
    this.loadingContent = true;
    this.getSetting$ = this.triggerService
      .getTriggerSettings(this.idSchedule)
      .pipe(finalize(() => {
        this.loadingContent = false;
      }))
      .subscribe(
        (data: IScheduleSettings) => {
          this.initProps(data);
          this.optionControlDropDown();
        },
        error => (this.errorLoadEntity = error)
      );
  }

  private initProps(data: IScheduleSettings) {
    this.componentCode = data.TriggerType.Code;
    this.data = data;
    this.active = data.Active;
    this.useDateBounds = !data.UseDateBounds;
    this.startDate = data.StartDateTime;
    this.endDate = data.EndDateTime;
  }

  optionControlDropDown() {
    this.getTypes$ = this.getTypes().subscribe(
      (data: IData[]) => {
        this.typeValues = data;
      },
      (error: any) => (this.errors = [error])
    );
  }

  save() {
    const result = mapFactory(this.childComp.first, this);
    if (this.childComp.first != null) {
      this.checkForErrors(result[this.componentCode]);
      if (this.errors.length) {
        return;
      }
    }
    this.loadingContent = true;
    this.postSetting$ = this.triggerService
      .putTriggerSettings(this.idSchedule, result)
      .subscribe(
        _ => {
          this.cancel();
        },
        error => {
            this.loadingContent = false;
            this.errors = [error];
        }
      );
  }

  cancel() {
    this.isPropEdit = false;
    this.data = null;
    this.loadTrigger();
  }

  private checkForErrors(result: any) {
    this.errors = [];
    this.loadingContent = true;
    const msg = AppLocalization.Label14;
    const checkRepeat = (component: any) => {
      if (!component.Time.OneTime) {
        const start = new Date(component.Time.StartTime);
        const end = new Date(component.Time.EndTime);
        const getHrs = (date: Date) => date.getHours();
        if (component.Time.RepeatType === null) {
          this.errors.push(msg + AppLocalization.Label106);
        }

        if (getHrs(start) > getHrs(end)) {
          this.errors.push(AppLocalization.NotCorrectTimeExecute);
        }
      }
    };
    let comp;
    switch (this.componentCode) {
      case 'Monthly':
        comp = result as IMonthly;
        if (!comp.Months.length) {
          this.errors.push(msg + AppLocalization.Months);
        } else if (comp.ByDays === undefined) {
          this.errors.push(msg + AppLocalization.Label105);
        } else if (comp.ByDays && !comp.Days.length) {
          this.errors.push(msg + AppLocalization.Label119);
        } else if (!comp.ByDays) {
          if (!comp.WeekDays.length) {
            this.errors.push(msg + AppLocalization._days_week);
          }
          if (!comp.Weeks.length) {
            this.errors.push(msg + AppLocalization.Label61);
          }
        } else { checkRepeat(comp); }
        break;
      case 'Weekly':
        comp = result as IWeekly;
        if (comp.FirstDate == null || !(comp.FirstDate as string).length) {
          this.errors.push(msg + AppLocalization._date_start);
        }
        if (comp.RepeatWeeks == null || comp.RepeatWeeks < 1) {
          this.errors.push(msg + AppLocalization.Label120);
        }
        if (!comp.WeekDays.length) {
            this.errors.push(msg + AppLocalization._days_week);
        } else { checkRepeat(comp); }
        break;
      case 'Daily':
        comp = result as IDaily;
        if (comp.FirstDate == null || !(comp.FirstDate as string).length) {
          this.errors.push(msg + AppLocalization._date_start);
        }
        if (comp.RepeatDays == null || comp.RepeatDays < 1) {
          this.errors.push(msg + AppLocalization.Label120);
        } else { checkRepeat(comp); }
        break;
      case 'OneTime':
        comp = result as IOneTime;
        if (comp.RunDateTime == null || !(comp.RunDateTime as string).length) {
          this.errors.push(msg + AppLocalization._date_and_time_execute);
        }
        break;
      default:
        break;
    }
    this.loadingContent = false;
  }

  private unsubscriber(sub: Subscription) {
    if (sub) {
      sub.unsubscribe();
    }
  }

  private getTypes() {
    const service = this.triggerService;
    return service.triggerTypesCache.length
      ? of(service.triggerTypesCache)
      : service.getTriggerTypes(this.idSchedule);
  }
}
