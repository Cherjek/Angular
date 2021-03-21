import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from "@angular/router";
import { Observable, Subscription, forkJoin } from 'rxjs';
import { finalize } from "rxjs/operators";

import { DataGrid, SelectionRowMode, ActionButtons as DGActionButton, ActionButtonConfirmSettings as DGActionButtonConfirmSettings } from "../../../../controls/DataGrid";

import {UsersFiltersContainerService} from "../../../../services/admin.module/admin.users/admin.users.main/Filters/UsersFiltersContainer.service";

import { AdminUsersService } from "../../../../services/admin.module/admin.users/AdminUsers.service";
import { AdminGroupsService } from "../../../../services/admin.module/admin.groups/AdminGroups.service";

import { AdminUsersToGroupsService } from "../../../../services/admin.module/admin.users/admin.users.main/AdminUsersToGroups.service";
import { AdminUser } from "../../../../services/admin.module/admin.users/Models/AdminUser";
import { AdminUserGroupView } from "../../../../services/admin.module/admin.groups/Models/AdminUserGroupView";
import { UsersToGroupsEntity } from "../../../../services/admin.module/admin.users/admin.users.main/Models/UsersToGroupsEntity";
import { AdminUserService } from "../../../../services/admin.module/admin.user/AdminUser.service";

import * as CommonConstant from "../../../../common/Constants";
import { PermissionCheck, DataGridCurrentItemService } from '../../../../core';
const statuses_names = CommonConstant.Common.Constants.ADMIN_MODULE.statuses_names;


@Component({
    selector: 'admin-users-main',
    templateUrl: './admin.users.main.html',
    styleUrls: ['./admin.users.main.css']
})
export class AdminUsersMainComponent implements OnInit {
    public loadingContentPanel: boolean;
    public errors: any[] = [];
    public allGroups: any[];
    private DGSelectionRowMode = SelectionRowMode;
    private filterKey: any;
    private dataSource: any[];
    private alertTimeout: any;
    deletePermissions: string[] = [];
    alert: any;

    @ViewChild('Ro5DataGrid', { static: true }) public dataGrid: DataGrid;
    @ViewChild('LoginColumnTemplate', { static: true }) private loginColumnTemplate: TemplateRef<any>;

    constructor(private router: Router,

                public filterContainerService: UsersFiltersContainerService,

                private usersService: AdminUsersService,
                private userService: AdminUserService,

                private groupsService: AdminGroupsService,
                private usersToGroupsService: AdminUsersToGroupsService,
                private permissionCheck: PermissionCheck,
                public dataGridCurrentItemService: DataGridCurrentItemService
                ) {

        this.groupsService
            .get()
            .subscribe((groups: AdminUserGroupView[]) => {
                this.allGroups = groups;
        });
    }

    ngOnInit() {
        this.renderUsersFromBackend();
    }

    private renderUsersFromBackend(filterKey?: any) {
        this.loadingContentPanel = true;
        this.usersService.getUsers(filterKey).subscribe(
            (users: AdminUser[]) => {
                this.initDG(users);
                this.loadingContentPanel = false;
            },
            (error: any) => {
                this.loadingContentPanel = false;
                this.errors.push(error);
            }
        );
    }

    private initDG(users: AdminUser[]) {

        this.accessDataGridInit().subscribe((results: boolean[]) => {

            this.dataGrid.initDataGrid();
            this.dataGrid.KeyField = 'Id';
            this.dataGrid.SelectionRowMode = this.DGSelectionRowMode.Multiple;

            if (results[0]) {
                this.deletePermissions = ['ADM_DELETE_USERS','ADM_DELETE_USER'];
                this.dataGrid.ActionButtons = [
                    new DGActionButton("Delete",
                        AppLocalization.Delete,
                        new DGActionButtonConfirmSettings(AppLocalization.DeleteUserAlert, AppLocalization.Delete))
                ];
            }

            this.dataSource = users.map((user: any) => {
                return {
                    'Id': user['Id'],
                    'Login': user['Login'],
                    'Name': user['Name'],
                    'PhoneNumber': user['PhoneNumber'],
                    'Email': user['Email'],
                    'Status': user['IsBlocked'] ? statuses_names.notActive : statuses_names.active,
                    'IdAuthenticityType': user['IdAuthenticityType']
                };
            });

            this.dataGrid.Columns = [
                {
                    Name: 'Login',
                    Caption: AppLocalization.User,
                    CellTemplate: this.loginColumnTemplate,
                    AppendFilter: false,
                    Width: 250,
                    disableTextWrap: true
                },
                {
                    Name: 'Name',
                    Caption: AppLocalization.Label111,
                    AppendFilter: false,
                    disableTextWrap: true
                },
                {
                    Name: 'PhoneNumber',
                    Caption: AppLocalization.Phone,
                    AppendFilter: false,
                    disableTextWrap: true
                },
                {
                    Name: 'Email',
                    Caption: AppLocalization.Email,
                    AppendFilter: false,
                    disableTextWrap: true
                },
                {
                    Name: 'Status',
                    Caption: AppLocalization.Activity,
                    AppendFilter: false,
                    disableTextWrap: true
                },
                {
                    Name: 'IdAuthenticityType',
                    Caption: AppLocalization.TypeOfAuthorization,
                    AppendFilter: false,
                    disableTextWrap: true
                }
            ];

            this.dataGrid.DataSource = this.dataSource;

        });
    }
    private accessDataGridInit(): Observable<boolean[]> {

        const checkAccess = [
            'ADM_DELETE_USER'
        ];

        const obsrvs: any[] = [];
        checkAccess.forEach((access: string | string[]) => {
            obsrvs.push(this.permissionCheck.checkAuthorization(access));
        });

        return forkJoin<boolean>(obsrvs);
    }
    public addUsersToGroups(users: AdminUser[], groups: AdminUserGroupView[]) {
        this.loadingContentPanel = true;
        let usersToGroups: UsersToGroupsEntity = new UsersToGroupsEntity(users, groups);

        this.usersToGroupsService
            .addUsers(usersToGroups)
            .then(() => {
                this.showAlert(AppLocalization.Successfully, 'success');
                this.loadingContentPanel = false;
            })
            .catch((error: any) => {
                if (error && error.ShortMessage && (error.ShortMessage as string).toLowerCase().startsWith('permission denied')) {
                    error.ShortMessage = AppLocalization.NoRightToAddUsersToGroups;
                  }
                this.errors.push(error);
                this.loadingContentPanel = false;
            });
    }

    public onDGRowActionBttnClick(button: any) {
        if (button.action == 'Delete') {
            this.deleteUsers([button.item.Id]);
        }
    }

    public deleteDGRows(rows: any[]) {
        let userIds: any[] = rows.map((row: any) => { return row.Id; });
        this.deleteUsers(userIds);
    }

    private deleteUsers(userIds: any[]) {
        this.loadingContentPanel = true;
        this.usersService
            .post(userIds, 'delete')
            .then(() => {
                this.renderUsersFromBackend(this.filterKey);
            })
            .catch((error: any) => {
                this.loadingContentPanel = false;
                this.errors.push(error);
            });
    }

    public createUser() {
        this.router.navigate([`/admin/user/new`]);
    }

    public onApplyFilter(filterKey: any) {
        this.renderUsersFromBackend(filterKey);
        this.filterKey = filterKey;
    }

    public exportUsers() {
        this.dataGrid.exportToExcel();
    }

    closeAlert() {
        this.alert = null;
        if (this.alertTimeout) {
          clearTimeout(this.alertTimeout);
        }
    }

    private showAlert(msg: string, type: string) {
        this.alert = {
          msg,
          type,
        };
        this.alertTimeout = setTimeout(() => {
          this.alert = null;
        }, 2000);
    }
}
