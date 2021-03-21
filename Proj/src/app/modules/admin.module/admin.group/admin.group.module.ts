import { NgModule } from '@angular/core';
import { AdminGroupComponent } from './admin-group.component';
import { AdminGroupPropertiesComponent } from './admin-group-properties/admin-group-properties.component';
import { AdminGroupGeoComponent } from './admin.group.geo/admin.group.geo';
import { AdminGroupGeoEditComponent } from './admin-group-geo-edit/admin-group-geo-edit';
import { AdminGroupGeoEditDataGridComponent } from './admin-group-geo-edit/admin-group-geo-edit-data-grid/admin-group-geo-edit-data-grid.component';
import { AdminGroupUsersComponent } from './admin.group.users/admin.group.users';
import { AdminGroupTypesAndTagsComponent } from './admin.group.typesandtags/admin.group.typesandtags';
import { AdminGroupReportsComponent } from './admin.group.reports/admin.group.reports';
import { AdminGroupHierarchyComponent } from './admin-group-hierarchy/admin-group-hierarchy';
import { AdminGroupUnitsComponent } from './admin-group-units/admin-group-units';
import { AdminGroupUnitsEditComponent } from './admin-group-units-edit/admin-group-units-edit';
import { AdminGroupModulesComponent } from './admin.group.modules/admin.group.modules';
import { AdminGroupRoutingModule } from './admin.group.routing.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { ControlsModule } from 'src/app/controls/ct.module';
import { CoreModule } from 'src/app/core/core.module';
import { SharedModule as Sh } from 'src/app/modules/requests/shared/shared.module';
import { AdminGroupsService } from 'src/app/services/admin.module/admin.groups/AdminGroups.service';
import { AdminGroupService } from 'src/app/services/admin.module/admin.group/AdminGroup.service';
import { AdminGroupUsersFilterContainerService } from 'src/app/services/admin.module/admin.group/admin.group.users/Filters/AdminGroupUsersFilterContainer.service';
import { AdminGroupUsersDefFiltersService } from 'src/app/services/admin.module/admin.group/admin.group.users/Filters/AdminGroupUsersDefFilters.service';
import { AdminGroupUsersAddFiltersService } from 'src/app/services/admin.module/admin.group/admin.group.users/Filters/AdminGroupUsersAddFilters.service';
import { AdminUsersService } from 'src/app/services/admin.module/admin.users/AdminUsers.service';
import { AdminUsersToGroupsService } from 'src/app/services/admin.module/admin.users/admin.users.main/AdminUsersToGroups.service';
import { AdminGroupUnitsFilterContainerService } from 'src/app/services/admin.module/admin.group/admin.group.units/Filters/AdminGroupUnitsFilterContainer.service';
import { AdminGroupUnitsDefFiltersService } from 'src/app/services/admin.module/admin.group/admin.group.units/Filters/AdminGroupUnitsDefFilters.service';
import { AdminGroupUnitsAddFiltersService } from 'src/app/services/admin.module/admin.group/admin.group.units/Filters/AdminGroupUnitsAddFilters.service';
import { AdminGroupSubSystemsComponent } from './admin.group.subsystems/admin.group.subsystems.component';
@NgModule({
  imports: [
    CoreModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    SharedModule,
    ControlsModule,
    AdminGroupRoutingModule,
    Sh
  ],
  declarations: [
    AdminGroupComponent,
    AdminGroupPropertiesComponent,
    AdminGroupGeoComponent,
    AdminGroupGeoEditComponent,
    AdminGroupGeoEditDataGridComponent,
    AdminGroupUsersComponent,
    AdminGroupTypesAndTagsComponent,
    AdminGroupReportsComponent,
    AdminGroupHierarchyComponent,
    AdminGroupUnitsComponent,
    AdminGroupUnitsEditComponent,
    AdminGroupModulesComponent,
    AdminGroupSubSystemsComponent
  ],
  providers: [
      AdminGroupsService,
      AdminGroupService,
      AdminGroupUsersFilterContainerService,
      AdminGroupUsersDefFiltersService,
      AdminGroupUsersAddFiltersService,
      AdminUsersService,
      AdminUsersToGroupsService,
      AdminGroupUnitsFilterContainerService,
      AdminGroupUnitsDefFiltersService,
      AdminGroupUnitsAddFiltersService
  ]
})
export class AdminGroupModule {}
