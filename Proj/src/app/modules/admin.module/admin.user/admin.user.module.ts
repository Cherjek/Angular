import { NgModule } from '@angular/core';
import { AdminUserComponent } from './admin.user';
import { AdminUserService } from 'src/app/services/admin.module/admin.user/AdminUser.service';
import { AdminUserPropertiestComponent } from './admin.user.properties/admin.user.properties';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { ControlsModule } from 'src/app/controls/ct.module';
import { AdminUserRoutingModule } from './admin.user.routing.module';
import { AdminGroupsService } from 'src/app/services/admin.module/admin.groups/AdminGroups.service';
import { CoreModule } from 'src/app/core/core.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    CoreModule,

    SharedModule,
    ControlsModule,
    AdminUserRoutingModule
  ],
  declarations: [AdminUserComponent, AdminUserPropertiestComponent],
  providers: [AdminUserService, AdminGroupsService]
})
export class AdminUserModule {}
