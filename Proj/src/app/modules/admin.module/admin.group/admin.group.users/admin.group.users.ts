import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminGroupService } from '../../../../services/admin.module/admin.group/AdminGroup.service';
import { AdminUsersService } from '../../../../services/admin.module/admin.users/AdminUsers.service';
import { AdminUser } from '../../../../services/admin.module/admin.users/Models/AdminUser';
import * as GridControls from '../../../../controls/DataGrid';
import DataGrid = GridControls.DataGrid;
import SelectionRowMode = GridControls.SelectionRowMode;
import DGActionButton = GridControls.ActionButtons;
import DGActionButtonConfirmSettings = GridControls.ActionButtonConfirmSettings;
import { AdminGroupUsersFilterContainerService } from '../../../../services/admin.module/admin.group/admin.group.users/Filters/AdminGroupUsersFilterContainer.service';
import { FilterRowPipe } from '../../../../shared/rom-pipes/filter-row.pipe';
import * as DateRangeModule from '../../../../common/models/Filter/DateRange';
import DateRange = DateRangeModule.Common.Models.Filter.DateRange;
import { AdminUsersFromGroupsService } from '../../../../services/admin.module/admin.users/admin.users.main/AdminUsersFromGroups.service';
import { AdminUsersToGroupsService } from '../../../../services/admin.module/admin.users/admin.users.main/AdminUsersToGroups.service';
import { AdminUserGroupView } from '../../../../services/admin.module/admin.groups/Models/AdminUserGroupView';
import { UsersToGroupsEntity } from '../../../../services/admin.module/admin.users/admin.users.main/Models/UsersToGroupsEntity';
import { Observable, Subscription, forkJoin } from 'rxjs';
import { finalize } from "rxjs/operators";
import { PermissionCheck } from "../../../../core";
import * as CommonConstant from "../../../../common/Constants";

const statuses_names = CommonConstant.Common.Constants.ADMIN_MODULE.statuses_names;

@Component({
    selector: 'admin-group-users',
    templateUrl: './admin-group-users.component.html',
    styleUrls: ['./admin-group-users.component.less']
})
export class AdminGroupUsersComponent implements OnInit {
    public errors: any[] = [];
    public loadingContentPanel: boolean;
    private urlParamsSubscribe: Subscription;
    private groupId: any;
    public allUsers: AdminUser[];
    private groupUsers: AdminUser[] = [];
    private BigDataSource: AdminUser[] = [];
    private appliedFilter: any; // фильтр примененный к гриду
    private Filter: FilterRowPipe = new FilterRowPipe();
    private DGSelectionRowMode = SelectionRowMode;
    @ViewChild('Ro5DataGrid', { static: true }) public dataGrid: DataGrid;
    @ViewChild('LoginColumnTemplate', { static: true }) private loginColumnTemplate: TemplateRef<any>;
    @ViewChild('DateColumnTemplate', { static: true }) private dateColumnTemplate: TemplateRef<any>;

    constructor(public filtersContainerService: AdminGroupUsersFilterContainerService,
                private adminGroupService: AdminGroupService,
                private usersService: AdminUsersService,
                private usersFromGroupsService: AdminUsersFromGroupsService,
                private usersToGroupsService: AdminUsersToGroupsService,
                private activatedRoute: ActivatedRoute,
                private router: Router,
                private permissionCheck: PermissionCheck) {
        this.urlParamsSubscribe = this.activatedRoute.parent.params.subscribe(
            params => {
                this.groupId = params.id;
            }
        );
    }

    ngOnInit() {
        this.loadGroupUsersData();
    }

    private loadAllUsersData() {
        this.usersService.getUsers().subscribe(
                (users: AdminUser[]) => {
                    users.forEach(user => {
                        /* если имя пользователя не указано то указываем его логин вместо него */
                        if (!user['Name'] || !user['Name'].trim().length) {
                            user['Name'] = user['Login'];
                        }
                    });
                    this.allUsers = users.filter((user: any) => {
                        return this.dataGrid.DataSource.find((groupUser) => {
                            return groupUser.Id === user.Id;
                        }) === undefined;
                    });

                },
                (error: any) => {
                    this.errors.push(error);
                }
        );
    }

    private loadGroupUsersData() {
        this.loadingContentPanel = true;
        this.adminGroupService.getUsers(this.groupId).subscribe(
            (users: AdminUser[]) => {
                this.initDG(users);

                this.loadAllUsersData();

                this.BigDataSource = [];
                this.dataGrid.DataSource.forEach((row: any) => {
                    this.BigDataSource.push({...row});
                });

                this.initFilter(users);

                if (this.appliedFilter) {
                    this.setFilter()
                        .then(() => this.loadingContentPanel = false);
                } else {
                    this.loadingContentPanel = false;
                }
            },
            (error: any) => {
                this.loadingContentPanel = false;
                this.errors.push(error);
            });
    }

    private initDG(users: AdminUser[]) {
        
        this.accessDataGridInit().subscribe((results: boolean[]) => {

            this.dataGrid.initDataGrid();
            this.dataGrid.KeyField = 'Id';
            this.dataGrid.SelectionRowMode = this.DGSelectionRowMode.Multiple;
            
            if (results[0]) {
                this.dataGrid.ActionButtons = [
                    new DGActionButton(
                        'Delete',
                        AppLocalization.Delete,
                        new DGActionButtonConfirmSettings(
                            AppLocalization.DeleteUserFromGroupAlert,
                            AppLocalization.Delete
                        )
                    )
                ];
            }

            this.dataGrid.Columns = [
                {
                    Name: 'Login',
                    Caption: AppLocalization.User,
                    CellTemplate: this.loginColumnTemplate,
                    AppendFilter: false,
                    Width: 250,
                    disableTextWrap: true,
                },
                {
                    Name: 'Name',
                    Caption: AppLocalization.Label111,
                    AppendFilter: false,
                    disableTextWrap: true,
                },
                {
                    Name: 'PhoneNumber',
                    Caption: AppLocalization.Phone,
                    AppendFilter: false,
                    disableTextWrap: true,
                },
                {
                    Name: 'Email',
                    Caption: AppLocalization.Email,
                    AppendFilter: false,
                    disableTextWrap: true,
                },
                {
                    Name: 'Status',
                    Caption: AppLocalization.Activity,
                    AppendFilter: false,
                    disableTextWrap: true,
                },
                {
                    Name: 'CreationDate',
                    CellTemplate: this.dateColumnTemplate,
                    Caption: AppLocalization.Created,
                    AppendFilter: false,
                    disableTextWrap: true,
                },
                {
                    Name: 'IdAuthenticityType',
                    Caption: AppLocalization.TypeOfAuthorization,
                    AppendFilter: false,
                    disableTextWrap: true,
                },
            ];
            this.dataGrid.DataSource = users.map(
                (user: any) => {
                    return {
                        Id: user.Id,
                        Login: user.Login,
                        Name: user.Name,
                        PhoneNumber: user.PhoneNumber,
                        Email: user.Email,
                        Status: user.IsBlocked ? statuses_names.notActive : statuses_names.active,
                        CreationDate: user.CreationDate,
                        IdAuthenticityType: user.IdAuthenticityType

                    };
                });

        });
    }
    private accessDataGridInit(): Observable<boolean[]> {

        const checkAccess = [
            'ADM_REMOVE_USER_FROM_GROUP'
        ];

        const obsrvs: any[] = [];
        checkAccess.forEach((access: string | string[]) => {
            obsrvs.push(this.permissionCheck.checkAuthorization(access));
        });

        return forkJoin<boolean>(obsrvs);
    }
    private initFilter(users: AdminUser[]) {
        this.filtersContainerService.filtersNewService.setCreationDateValues(users);
    }

    public addUsersToGroup(users: AdminUser[]) {
        this.loadingContentPanel = true;
        const group: AdminUserGroupView = new AdminUserGroupView(this.groupId, null, null);
        const usersToGroups: UsersToGroupsEntity = new UsersToGroupsEntity(users, [group]);
        this.usersToGroupsService.addUsers(usersToGroups).then(
            () => {
                this.loadGroupUsersData();
            }).catch(
            (error: any) => {
                if (error && error.ShortMessage && (error.ShortMessage as string).toLowerCase().startsWith('permission denied')) {
                    error.ShortMessage = AppLocalization.NoRightToAddUsersToGroups;
                  }
                this.loadingContentPanel = false;
                this.errors.push(error);
            });
    }

    public deleteUsersFromGroup(users: AdminUser[]) {
        this.loadingContentPanel = true;
        const group: AdminUserGroupView = new AdminUserGroupView(this.groupId, null, null);
        const usersFromGroup: UsersToGroupsEntity = new UsersToGroupsEntity(users, [group]);
        this.usersFromGroupsService.deleteUsers(usersFromGroup).then(
            () => {
                this.loadGroupUsersData();
            }).catch(
            (error) => {
                this.loadingContentPanel = false;
                this.errors.push(error);
            });
    }

    public onDGRowActionBtnClick(button: any) {
        if (button.action === 'Delete') {
            this.deleteUsersFromGroup([button.item]);
        }
    }

    public onApplyFilter(filters: any[]) {
        this.appliedFilter = {};
        (filters || []).forEach((f: any) => {
            const val = f.Value;
            if (f.Code === 'Status' || f.Code === 'IdAuthenticityType') {
                this.appliedFilter[f.Code] = val.map((item: any) => item.Name);
            } else if (f.Code === 'CreationDate') {
                this.appliedFilter[f.Code] = Object.assign(new DateRange(), val);
            }
        });
        this.loadingContentPanel = true;
        setTimeout(() => {
            this.setFilter().then(() => this.loadingContentPanel = false);
        }, 100);
    }

    private setFilter(): Promise<boolean> {
        return new Promise(
            (resolve, reject) => {
                try {
                    this.dataGrid.DataSource = this.Filter.transform(this.BigDataSource, '', this.appliedFilter);
                    resolve();
                } catch (e) {
                    reject(e);
                }
            });
    }

    private hideAuthTypeComboBox(cb: any) {
        setTimeout(() => {
            cb.model = null;
        }, 0);
    }
}
