import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScheduleCardRoutingModule } from './schedule-card-routing.module';
import { ScheduleCardPropertiesComponent } from './components/schedule-card-properties/schedule-card-properties.component';
import { ScheduleCardTriggerComponent } from './components/schedule-card-trigger/schedule-card-trigger.component';
import { ScheduleCardHierarchyComponent } from './components/schedule-card-hierarchy/schedule-card-hierarchy.component';
import { ScheduleCardStepsComponent } from './components/schedule-card-steps/schedule-card-steps.component';
import { ScheduleCardLogComponent } from './components/schedule-card-log/schedule-card-log.component';
import { ControlsModule } from 'src/app/controls/ct.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreModule } from 'src/app/core/core.module';
import { ScheduleCardComponent } from './components/schedule-card/schedule-card.component';
import {
  ScheduleCardService,
  ScheduleStepService,
  ScheduleTriggerService,
  ScheduleJournalService
} from 'src/app/services/schedules.module';
import { SharedHierarchyModule } from '../../additionally-hierarchies/shared/shared.module';
import { SettingsContinuousComponent } from './containers/settings-continuous/settings-continuous.component';
import { SettingsDailyComponent } from './containers/settings-daily/settings-daily.component';
import { SettingsWeeklyComponent } from './containers/settings-weekly/settings-weekly.component';
import { SettingsMonthlyComponent } from './containers/settings-monthly/settings-monthly.component';
import { SettingsOnetimeComponent } from './containers/settings-onetime/settings-onetime.component';
import { SettingsTimeParamsComponent } from './containers/settings-time-params/settings-time-params.component';
import { SharedModule as Shared } from '../shared/shared.module';

@NgModule({
  declarations: [
    ScheduleCardPropertiesComponent,
    ScheduleCardTriggerComponent,
    ScheduleCardHierarchyComponent,
    ScheduleCardStepsComponent,
    ScheduleCardLogComponent,
    ScheduleCardComponent,
    SettingsContinuousComponent,
    SettingsDailyComponent,
    SettingsWeeklyComponent,
    SettingsMonthlyComponent,
    SettingsOnetimeComponent,
    SettingsTimeParamsComponent
  ],
  imports: [
    CommonModule,
    ScheduleCardRoutingModule,
    ControlsModule,
    SharedModule,
    SharedHierarchyModule,
    CoreModule,
    Shared
  ],
  providers: [ScheduleCardService, ScheduleStepService, ScheduleJournalService, ScheduleTriggerService]
})
export class ScheduleCardModule {}
