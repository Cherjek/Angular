import { NgModule } from '@angular/core';
import { AdminGroupsComponent } from './admin.groups';
import { AdminGroupsRoutingModule } from './admin.groups.routing.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { ControlsModule } from 'src/app/controls/ct.module';
import { AdminGroupsService } from 'src/app/services/admin.module/admin.groups/AdminGroups.service';
import { AdminGroupsFilterContainerService } from 'src/app/services/admin.module/admin.groups/Models/Filters/AdminGroupsFilterContainer.service';
import { AdminGroupsFiltersService } from 'src/app/services/admin.module/admin.groups/Models/Filters/AdminGroupsFilters.service';
import { AdminGroupsFiltersNewService } from 'src/app/services/admin.module/admin.groups/Models/Filters/AdminGroupsFiltersNew.service';
import { AdminGroupsMainComponent } from './admin.groups.main/admin.groups.main';
import { AdminUsersService } from 'src/app/services/admin.module/admin.users/AdminUsers.service';
import { AdminUsersToGroupsService } from 'src/app/services/admin.module/admin.users/admin.users.main/AdminUsersToGroups.service';
import { CoreModule } from 'src/app/core/core.module';

@NgModule({
  imports: [
    CoreModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,

    SharedModule,
    ControlsModule,
    AdminGroupsRoutingModule
  ],
  exports: [],
  declarations: [AdminGroupsComponent, AdminGroupsMainComponent],
  providers: [
    AdminGroupsService,
    AdminGroupsFilterContainerService,
    AdminGroupsFiltersService,
    AdminGroupsFiltersNewService,
    AdminUsersService,
    AdminUsersToGroupsService
  ]
})
export class AdminGroupsModule {}
