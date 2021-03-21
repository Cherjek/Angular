import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/index';
import { ContextButtonItem, ContextButtonItemConfirm } from '../../../controls/ContextButton/ContextButtonItem';
import { NavigateItem } from '../../../common/models/Navigate/NavigateItem';
import { AdminGroupsService } from '../../../services/admin.module/admin.groups/AdminGroups.service';
import { AdminGroupService } from '../../../services/admin.module/admin.group/AdminGroup.service';
import { GlobalValues } from '../../../core';

@Component({
    selector: 'app-admin-group',
    templateUrl: './admin-group.component.html',
    styleUrls: ['./admin-group.component.less']
})
export class AdminGroupComponent {
    public loadingPanel: boolean;
    public headerErrors: any[] = [];
    public urlParamsSubscribe: Subscription;
    public menuItems: NavigateItem[] = [
        {
            code: 'properties',
            url: 'properties',
            name: AppLocalization.Properties,
            isActive: true,
            access: 'ADM_VIEW_GROUP_PROPERTIES',
        },
        {
            code: 'users',
            url: 'users',
            name: AppLocalization.Users,
            access: 'ADM_VIEW_GROUP_USERS',
        },
        {
            code: 'subsystems',
            url: 'subsystems',
            name: AppLocalization.Subsystems,
            access: 'ADM_VIEW_GROUP_SUBSYSTEMS',
        },
        {
            code: 'geo',
            url: 'geo',
            name: AppLocalization.Geography,
            isActive: true,
            access: 'ADM_VIEW_GROUP_GEO',
        },
        {
            code: 'units',
            url: 'units',
            name: AppLocalization.Objects,
            access: 'ADM_VIEW_GROUP_EQUIPMENT',
        },
        {
            code: 'types-and-tags',
            url: 'types-and-tags',
            name: AppLocalization.TypesAndTags,
            access: 'ADM_VIEW_GROUP_TAG_TYPES',
        },
        {
            code: 'reports',
            url: 'reports',
            name: AppLocalization.Reports,
            access: 'ADM_VIEW_GROUP_REPORTS',
        },
        {
            code: 'hierarchy',
            url: 'hierarchy',
            name: AppLocalization.Hierarchies,
            access: 'ADM_VIEW_GROUP_HIERARCHIES',
        },
        {
            code: 'modules',
            url: 'modules',
            name: AppLocalization.Modules,
            access: 'ADM_VIEW_GROUP_PERMISSIONS',
        }
    ];
    public contextButtonItems: ContextButtonItem[] = [
        {
            code: 'delete',
            name: AppLocalization.Delete,
            confirm: new ContextButtonItemConfirm(AppLocalization.DeleteConfirm, AppLocalization.Delete)
        }
    ];

    public get isNew() {
        return this.groupId === 'new';
    }

    public header: string;
    public groupId: string | number;

    constructor(public activatedRoute: ActivatedRoute,
                public adminGroupsService: AdminGroupsService,
                public adminGroupService: AdminGroupService) {
        this.urlParamsSubscribe = this.activatedRoute.params.subscribe(
            params => {
                this.groupId = params.id;
                this.loadInfoGroup();
            }
        );
    }

    public loadInfoGroup() {
        if (!this.isNew) {
            this.adminGroupService
                .get(`${this.groupId}/info`)
                .subscribe((info: any) => {
                        this.loadingPanel = false;
                        this.header = info.Name;
                    },
                    (error: any) => {
                        this.loadingPanel = false;
                        this.headerErrors = [error];
                    });
        }
    }

    public contextButtonHeaderClick(code: string) {
        this.loadingPanel = true;
        let promise: Promise<any> = null;
        let callback: Function;
        if (code === 'delete') {
            promise = this.adminGroupService.delete(this.groupId);
            callback = (result: any) => {
                if (result === 0) {
                    GlobalValues.Instance.Page.backwardButton.navigate();
                }
            };
        }
        promise.then(
            (result: any) => {
                this.loadingPanel = false;
                callback(result);
            }).catch(
            (error: any) => {
                this.loadingPanel = false;
                this.headerErrors = [error];
            });
    }
}
