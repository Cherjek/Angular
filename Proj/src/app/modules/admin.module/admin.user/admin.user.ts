import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnDestroy } from '@angular/core';
import { NavigateItem } from '../../../common/models/Navigate/NavigateItem';
import { ActivatedRoute, Router } from '@angular/router';
import { ContextButtonItem } from '../../../controls/ContextButton/ContextButtonItem';
import { AdminUserService } from '../../../services/admin.module/admin.user/AdminUser.service';
import { Subscription } from 'rxjs';

import { GlobalValues } from '../../../core';

@Component({
    selector: 'admin-user',
    templateUrl: './admin-user.component.html',
    styleUrls: ['./admin-user.component.less']
})
export class AdminUserComponent implements OnDestroy {
    public userId: any;
    public userLogin: string;
    public userName: string;
    public noUser = false;
    public subscription: Subscription;
    public querySubscription: Subscription;
    public loadingContentPanel: boolean;
    public errors: any[] = [];
    GlobalValues = GlobalValues.Instance;
    public menuItems: NavigateItem[] = [
        {
            code: 'properties',
            url: 'properties',
            name: AppLocalization.Properties,
            isDisabled: false,
            isActive: true,
            access: 'ADM_VIEW_USER_PROPERTIES',
        }
    ];
    public contextButtonItems: ContextButtonItem[] = [
        {
            code: 'delete',
            name: AppLocalization.Delete,
            isDisabled: false,
        }
    ];
    get newUser() {
        return this.userId === 'new';
    }

    constructor(public activatedRoute: ActivatedRoute,
                public userService: AdminUserService,
                public router: Router) {
        this.GlobalValues.Page['adminUserName'] = null;
        this.subscription = this.activatedRoute.params.subscribe(params => {
            this.userId = params.id;
            if (!this.newUser) {
                this.querySubscription = this.activatedRoute.queryParams.subscribe(queryParams => {
                    this.userName = queryParams.name;
                    this.userLogin = queryParams.login;
                });
                this.userService.getUser(this.userId).subscribe(
                    () => {
                    },
                    () => {
                        this.noUser = true;
                    }
                );
            }
        });
    }

    ngOnDestroy(): void {
        if (!this.newUser) {
            this.querySubscription.unsubscribe();
        }
        this.subscription.unsubscribe();
    }

    contextButtonHeaderClick(event: any): void {
        this.loadingContentPanel = true;
        if (event === 'delete') {
            this.userService.deleteUser(this.userId).then(
                () => {
                    this.loadingContentPanel = false;
                    this.router.navigate(['admin/users']);
                }).catch(
                (error) => {
                    this.loadingContentPanel = false;
                    this.errors.push(error);
                });
        }
    }
}
