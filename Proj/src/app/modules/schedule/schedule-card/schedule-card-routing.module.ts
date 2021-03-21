import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ScheduleCardComponent } from './components/schedule-card/schedule-card.component';
import { ScheduleCardPropertiesComponent } from './components/schedule-card-properties/schedule-card-properties.component';
import { ScheduleCardTriggerComponent } from './components/schedule-card-trigger/schedule-card-trigger.component';
import { ScheduleCardHierarchyComponent } from './components/schedule-card-hierarchy/schedule-card-hierarchy.component';
import { ScheduleCardStepsComponent } from './components/schedule-card-steps/schedule-card-steps.component';
import { ScheduleCardLogComponent } from './components/schedule-card-log/schedule-card-log.component';
import { CanAccessGuard } from 'src/app/core';

const routes: Routes = [
  {
    path: '',
    component: ScheduleCardComponent,
    children: [
      { path: '', redirectTo: 'properties' },
      {
        path: 'properties',
        component: ScheduleCardPropertiesComponent,
        data: { access: 'SDL_VIEW', noAccessNavigateTo: 'trigger' },
        canActivate: [CanAccessGuard]
      },
      {
        path: 'trigger',
        component: ScheduleCardTriggerComponent,
        data: { access: 'SDL_TRIGGER_VIEW', noAccessNavigateTo: 'hierarchy' },
        canActivate: [CanAccessGuard]
      },
      {
        path: 'hierarchy',
        component: ScheduleCardHierarchyComponent,
        data: { access: 'SDL_NODES_VIEW', noAccessNavigateTo: 'steps' },
        canActivate: [CanAccessGuard]
      },
      {
        path: 'steps',
        component: ScheduleCardStepsComponent,
        data: { access: 'SDL_STEPS_VIEW', noAccessNavigateTo: 'journal' },
        canActivate: [CanAccessGuard]
      },
      {
        path: 'journal',
        component: ScheduleCardLogComponent,
        data: { access: 'SDL_JOURNAL_VIEW' },
        canActivate: [CanAccessGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScheduleCardRoutingModule {}
