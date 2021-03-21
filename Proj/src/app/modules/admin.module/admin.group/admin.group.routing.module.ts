import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanAccessGuard } from 'src/app/core';
import { AdminGroupComponent } from './admin-group.component';
import { AdminGroupPropertiesComponent } from './admin-group-properties/admin-group-properties.component';
import { AdminGroupUsersComponent } from './admin.group.users/admin.group.users';
import { AdminGroupGeoComponent } from './admin.group.geo/admin.group.geo';
import { AdminGroupUnitsComponent } from './admin-group-units/admin-group-units';
import { AdminGroupTypesAndTagsComponent } from './admin.group.typesandtags/admin.group.typesandtags';
import { AdminGroupModulesComponent } from './admin.group.modules/admin.group.modules';
import { AdminGroupReportsComponent } from './admin.group.reports/admin.group.reports';
import { AdminGroupHierarchyComponent } from './admin-group-hierarchy/admin-group-hierarchy';
import { AdminGroupGeoEditComponent } from './admin-group-geo-edit/admin-group-geo-edit';
import { AdminGroupUnitsEditComponent } from './admin-group-units-edit/admin-group-units-edit';
import { AdminGroupSubSystemsComponent } from './admin.group.subsystems/admin.group.subsystems.component';

const routes: Routes = [
  {
    path: '',
    component: AdminGroupComponent,
    children: [
      { path: '', redirectTo: 'properties', pathMatch: 'full' },
      {
        path: 'properties',
        component: AdminGroupPropertiesComponent,
        data: {
          access: ['ADM_GROUPS_ALLOW', 'ADM_VIEW_GROUP_PROPERTIES'],
          noAccessNavigateTo: 'users'
        },
        canActivate: [CanAccessGuard]
      },
      {
        path: 'users',
        component: AdminGroupUsersComponent,
        data: {
          access: ['ADM_GROUPS_ALLOW', 'ADM_VIEW_GROUP_USERS'],
          noAccessNavigateTo: 'geo'
        },
        canActivate: [CanAccessGuard]
      },
      {
        path: 'geo',
        component: AdminGroupGeoComponent,
        data: {
          access: ['ADM_GROUPS_ALLOW', 'ADM_VIEW_GROUP_GEO'],
          noAccessNavigateTo: 'units'
        },
        canActivate: [CanAccessGuard]
      },
      {
        path: 'units',
        component: AdminGroupUnitsComponent,
        data: {
          access: ['ADM_GROUPS_ALLOW', 'ADM_VIEW_GROUP_EQUIPMENT'],
          noAccessNavigateTo: 'types-and-tags'
        },
        canActivate: [CanAccessGuard]
      },
      {
        path: 'types-and-tags',
        component: AdminGroupTypesAndTagsComponent,
        data: {
          access: ['ADM_GROUPS_ALLOW', 'ADM_VIEW_GROUP_TAG_TYPES'],
          noAccessNavigateTo: 'modules'
        },
        canActivate: [CanAccessGuard]
      },
      {
        path: 'modules',
        component: AdminGroupModulesComponent,
        data: {
          access: ['ADM_GROUPS_ALLOW', 'ADM_VIEW_GROUP_PERMISSIONS'],
          noAccessNavigateTo: 'reports'
        },
        canActivate: [CanAccessGuard]
      },
      {
        path: 'reports',
        component: AdminGroupReportsComponent,
        data: { 
          access: ['ADM_GROUPS_ALLOW', 'ADM_VIEW_GROUP_REPORTS'],
          noAccessNavigateTo: 'hierarchy'
        },
        canActivate: [CanAccessGuard]
      },
      {
        path: 'hierarchy',
        component: AdminGroupHierarchyComponent,
        data: { 
          access: ['ADM_GROUPS_ALLOW', 'ADM_VIEW_GROUP_HIERARCHIES'],
          noAccessNavigateTo: 'subsystems'
        },
        canActivate: [CanAccessGuard]
      },
      {
        path: 'subsystems',
        component: AdminGroupSubSystemsComponent,
        data: { access: ['ADM_VIEW_GROUP_SUBSYSTEMS'] },
        canActivate: [CanAccessGuard],
      },
    ],
    data: { access: 'ADM_GROUPS_ALLOW' },
    canActivate: [CanAccessGuard]
  },
  {
    path: 'geo-edit',
    component: AdminGroupGeoEditComponent,
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    data: {
      access: ['ADM_GROUPS_ALLOW', 'ADM_VIEW_GROUP_GEO', 'ADM_EDIT_GROUP_GEO']
    },
    canActivate: [CanAccessGuard]
  },
  {
    path: 'units-edit',
    component: AdminGroupUnitsEditComponent,
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    data: {
      access: [
        'ADM_GROUPS_ALLOW',
        'ADM_VIEW_GROUP_GEO',
        'ADM_VIEW_GROUP_EQUIPMENT'
      ]
    },
    canActivate: [CanAccessGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  declarations: []
})
export class AdminGroupRoutingModule {}
