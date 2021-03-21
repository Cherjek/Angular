import { NgModule } from '@angular/core';
import { AdminUsersComponent } from './admin.users';
import { AdminUsersMainComponent } from './admin.users.main/admin.users.main';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { ControlsModule } from 'src/app/controls/ct.module';
import { AdminUsersRoutingModule } from './admin.users.routing.module';
import { AdminUsersService } from 'src/app/services/admin.module/admin.users/AdminUsers.service';
import { AdminUsersToGroupsService } from 'src/app/services/admin.module/admin.users/admin.users.main/AdminUsersToGroups.service';
import { AdminUsersFromGroupsService } from 'src/app/services/admin.module/admin.users/admin.users.main/AdminUsersFromGroups.service';
import { UsersFiltersContainerService } from 'src/app/services/admin.module/admin.users/admin.users.main/Filters/UsersFiltersContainer.service';
import { UsersFiltersService } from 'src/app/services/admin.module/admin.users/admin.users.main/Filters/UsersFilters.service';
import { UsersNewFiltersService } from 'src/app/services/admin.module/admin.users/admin.users.main/Filters/UsersNewFilters.service';
import { AdminUserService } from 'src/app/services/admin.module/admin.user/AdminUser.service';
import { AdminGroupsService } from 'src/app/services/admin.module/admin.groups/AdminGroups.service';
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
    AdminUsersRoutingModule
  ],
  declarations: [AdminUsersComponent, AdminUsersMainComponent],
  providers: [
    UsersFiltersContainerService,
    UsersFiltersService,
    UsersNewFiltersService,
    AdminUsersService,
    AdminUserService,
    AdminGroupsService,
    AdminUsersToGroupsService,
    AdminUsersFromGroupsService
  ]
})
export class AdminUsersModule {}
