import { AppLocalization } from 'src/app/common/LocaleRes';
import {Component, OnInit, ViewChild, TemplateRef, AfterContentChecked} from '@angular/core';
import { Router } from "@angular/router";

import { Observable, Subscription, forkJoin } from 'rxjs';
import { finalize } from "rxjs/operators";

import { AdminGroupsService } from "../../../../services/admin.module/admin.groups/AdminGroups.service";
import { AdminUserGroupView } from "../../../../services/admin.module/admin.groups/Models/AdminUserGroupView";
import { AdminGroupsFilterContainerService } from "../../../../services/admin.module/admin.groups/Models/Filters/AdminGroupsFilterContainer.service";

import * as GridControls from '../../../../controls/DataGrid';
import DataGrid = GridControls.DataGrid;
import DGSelectionRowMode = GridControls.SelectionRowMode;
import DGActionButtom = GridControls.ActionButtons;
import DGActionButtonConfirmSettings = GridControls.ActionButtonConfirmSettings;

import * as CommonConstant from "../../../../common/Constants";

import { AdminUsersService } from "../../../../services/admin.module/admin.users/AdminUsers.service";
import { AdminUser } from "../../../../services/admin.module/admin.users/Models/AdminUser";

import { UsersToGroupsEntity } from "../../../../services/admin.module/admin.users/admin.users.main/Models/UsersToGroupsEntity";
import { AdminUsersToGroupsService } from "../../../../services/admin.module/admin.users/admin.users.main/AdminUsersToGroups.service";
import { PermissionCheck, DataGridCurrentItemService } from '../../../../core';
import { FiltersCustomPanelComponent } from "../../../../shared/rom-forms/filters.custompanel";
import { AdminGroupService } from 'src/app/services/admin.module/admin.group/AdminGroup.service';



const key = 'AccessListInfoComponent.item.save';

@Component({
    selector: 'app-admin.groups.main',
    templateUrl: './admin.groups.main.html',
    styleUrls: ['./admin.groups.main.css'],
    providers: [AdminGroupService]
})
export class AdminGroupsMainComponent implements OnInit, AfterContentChecked {

    public errors: any[] = [];
    public loadingContentPanel: boolean;
    private cacheFilter: any;
    private beforeInitFilterApply: boolean = true;
    massDeleteCode = '';

    @ViewChild('Ro5DataGrid', { static: true }) public dataGrid: DataGrid;
    @ViewChild('cellNameTemplate', { static: true }) cellNameTemplate: TemplateRef<any>;
    @ViewChild('filtersCustomPanel', { static: true }) filtersCustomPanel: FiltersCustomPanelComponent;
    public DGSelectionRowMode = DGSelectionRowMode;
    private statuses_names = CommonConstant.Common.Constants.ADMIN_MODULE.statuses_names;
    public filtersCustomDefault: any[];

    public allUsers: any[];

    constructor(public adminGroupsService: AdminGroupsService,
                public adminGroupsFilterContainerService: AdminGroupsFilterContainerService,
                public adminGroupService: AdminGroupService,

                private usersService: AdminUsersService,
                private usersToGroupsService: AdminUsersToGroupsService,

                public router: Router,

                private permissionCheck: PermissionCheck,
                public dataGridCurrentItemService: DataGridCurrentItemService) { }

    ngOnInit() {
        this.loadGroupsData();
        this.loadUsersData();
        this.loadFiltersGroupPermission();
    }

    ngAfterContentChecked() {
        this.checkOnAccessListInfoComponentComeOut();
    }

    private checkOnAccessListInfoComponentComeOut() {
        // const key = 'AccessListInfoComponent.item.save';
        const itemSave = localStorage.getItem(key);

        if (itemSave) { // перешли с компонента AccessListInfoComponent
            if (this.filtersCustomPanel.FiltersContainer && this.filtersCustomPanel.FiltersContainer.Filters && // некоторые фильтры инициализировались
                this.dataGrid.DataSource) { // грид инициализировался
                let initializedFiltersCustomDefault = this.filtersCustomPanel.FiltersContainer.Filters.find((filter: any) => { return filter.Name == this.filtersCustomDefault[0].Name; });
                if (initializedFiltersCustomDefault) { // дефолтный фильтр тоже инициализировался
                    localStorage.removeItem(key);
                    this.filtersCustomPanel.applyFilter();
                }
            }
        }
    }

    //если был переход из формы модули, проверяем наличие в storage записи
    //подставляем в дефолтные фильтр new
    private loadFiltersGroupPermission() {

        const itemSave = localStorage.getItem(key);

        if (itemSave) {
            const itemParse = JSON.parse(itemSave);

            this.filtersCustomDefault = [
                {
                    Caption: AppLocalization.Label67,
                    IdCategory: 1,
                    Name: 'Permissions',
                    FilterType: 'Tree',
                    SelectedOperationType: 'Equal',
                    IsNew: true,
                    IsDefault: false,
                    Value: [
                        {
                            Id: itemParse.Id,
                            Name: itemParse.Name,
                            TreeLevelCode: 'P'
                        }
                    ]
                }
            ];

            // localStorage.removeItem(key);
        }

    }

    private loadUsersData() {
        this.usersService.getUsers().subscribe(
            (users: AdminUser[]) => {
                users.forEach(user => {
                    /* если имя пользователя не указано то указываем его логин вместо него */
                    if (!user['Name'] || !user['Name'].trim().length) {
                        user['Name'] = user['Login'];
                    }
                });
                this.allUsers = users;
            },
            (error: any) => {
                if (error && error.ShortMessage && (error.ShortMessage as string).toLowerCase().startsWith('permission denied')) {
                    error.ShortMessage = AppLocalization.NoAccessToTheUserList;
                  }
                this.errors.push(error);
            }
        );
    }

    private initDG(groups: AdminUserGroupView[]) {
        
        this.accessDataGridInit().subscribe((results: boolean[]) => {

            this.dataGrid.initDataGrid();
            this.dataGrid.KeyField = 'Id';
            this.dataGrid.Columns = [{
                Caption: AppLocalization.GroupName,
                Name: "Name",
                CellTemplate: this.cellNameTemplate,
                disableTextWrap: true,
            }, {
                Caption: AppLocalization.Activity,
                Name: "Status"
            }];
            if (results[0]) {
                this.massDeleteCode = 'ADM_DELETE_GROUPS';
                this.dataGrid.ActionButtons = [
                    new DGActionButtom("Delete",
                        AppLocalization.Delete,
                        new DGActionButtonConfirmSettings(AppLocalization.DeleteConfirm, AppLocalization.Delete))
                ];
            }

            this.dataGrid.DataSource = groups;

        }, (error: any) => {
            if (error && error.ShortMessage && (error.ShortMessage as string).toLowerCase().startsWith('permission denied')) {
                error.ShortMessage = AppLocalization.Label21;
              }
            this.loadingContentPanel = false;
            this.errors.push(error);
        });
    }
    private accessDataGridInit(): Observable<boolean[]> {

        const checkAccess = [
            'ADM_DELETE_GROUP',
            'ADM_DELETE_GROUPS'
        ];

        const obsrvs: any[] = [];
        checkAccess.forEach((access: string | string[]) => {
            obsrvs.push(this.permissionCheck.checkAuthorization(access));
        });

        return forkJoin<boolean>(obsrvs);
    }
    private loadGroupsData() {

        let filterKey = this.cacheFilter;

        this.loadingContentPanel = true;
        this.adminGroupsService
            .get(filterKey)
            .subscribe((groups: AdminUserGroupView[]) => {
                this.loadingContentPanel = false;
                this.initDG((groups || []).map((group: AdminUserGroupView) => {
                    group["Status"] = !group.IsBlocked ? this.statuses_names.active : this.statuses_names.notActive;
                    return group;
                }));
            },
            (error: any) => {
                this.loadingContentPanel = false;
                this.errors.push(error);
            });
    }

    public createGroup() {
        this.router.navigate(['/admin/group/new/properties']);
    }

    public onApplyFilter(filters: any) {
        this.cacheFilter = filters;
        this.loadGroupsData();
    }

    public onDGRowActionBttnClick(button: any) {
        if (button.action === 'Delete') {
            this.deleteGroup(button.item.Id);
        }
    }

    deleteGroup(id: number) {
      this.loadingContentPanel = true;
        this.adminGroupService
            .delete(id)
            .then((res: any) => {
                this.loadingContentPanel = false;
                this.loadGroupsData(); // ререндерим заново строки с бэкенда
            })
            .catch((error: any) => {
                this.loadingContentPanel = false;
                this.errors = [error];
            });
    }

    deleteGroups(ids: any[]) {
        ids = (ids || []).map(x => x && x.Id);
        if (!isNaN(ids[0])) {
        this.loadingContentPanel = true;
        this.adminGroupsService
            .post(ids, `delete`)
            .then((res: any) => {
                this.loadingContentPanel = false;
                this.loadGroupsData(); // ререндерим заново строки с бэкенда
            })
            .catch((error: any) => {
                this.loadingContentPanel = false;
                this.errors = [error];
            });
        }
    }

    addUsersToGroups(users: AdminUser[], groups: AdminUserGroupView[]) {
        this.loadingContentPanel = true;
        let usersToGroups: UsersToGroupsEntity = new UsersToGroupsEntity(users, groups);

        this.usersToGroupsService
            .addUsers(usersToGroups)
            .then(() => {
                this.loadingContentPanel = false;
            })
            .catch((error: any) => {
                this.loadingContentPanel = false;
                this.errors.push(error);
            });
    }
}
