import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs/index";

import { AdminGroupService } from "../../../../services/admin.module/admin.group/AdminGroup.service";
import {ListView} from "../../../../controls/ListView/ListView";

@Component({
    selector: 'admin-group-modules',
    templateUrl: './admin.group.modules.html',
    styleUrls: ['./admin.group.modules.css']
})
export class AdminGroupModulesComponent implements OnInit, OnDestroy {

    public errors: any[] = [];
    public modulesLoading: boolean;

    private urlParamsSubscription: Subscription;
    private groupId: string | number;

    modulePermissions: any[];
    initCurrModulePermissions: any[];
    currModule: any;

    editMode: boolean = false;

    constructor(public adminGroupService: AdminGroupService,
                public activatedRoute: ActivatedRoute,
                public router: Router) {

        this.urlParamsSubscription = this.activatedRoute.parent.params.subscribe(
            (params: any) => {
                this.groupId = params['id'];
            },
            (error: any) => {
                this.errors = [error];
            }
        );
    }

    initModules() {
        this.modulesLoading = true;
        this.adminGroupService
            .getModulePermissions(this.groupId)
            .subscribe(
                (module_permissions: any[]) => {
                    this.modulePermissions = module_permissions;
                    if (this.modulePermissions.length) {
                            this.currModule = this.modulePermissions[0];
                    }

                    this.modulesLoading = false;
                },
                (error: any) => {
                    this.errors = [error];
                    this.modulesLoading = false;
                });
    }

    ngOnInit() {
        this.initModules();
    }

    changeCurrModulePermissions() {
        this.editMode = true;

        let cloneModulePermissions: any = (modulePermissions: any[]) => {
            let modulePermissionsClone: any[] = [];

            modulePermissions.forEach((item: any) => {
                let itemClone: any = { ... item };
                modulePermissionsClone.push(itemClone);
            });

            return modulePermissionsClone;
        };

        this.initCurrModulePermissions = cloneModulePermissions(this.currModule.Permissions);
    }

    saveCurrModulePermissionsChanges() {
        this.modulesLoading = true;
        this.editMode = false;

        this.adminGroupService
            .postModulePermissions(this.groupId, this.modulePermissions)
            .then((response: any) => {
                this.modulesLoading = false;
            })
            .catch((error: any) => {
                this.errors = [error];
                this.modulesLoading = false;
            });
    }

    cancelCurrModulePermissionsChanges() {
        this.currModule.Permissions = this.initCurrModulePermissions;

        this.editMode = false;
    }

    onModuleClick(event: any) {
        if (!this.editMode) {
            this.currModule = event['Data'];
        }
    }

    ngOnDestroy() {
        this.urlParamsSubscription.unsubscribe();
    }
}
