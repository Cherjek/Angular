import { AppLocalization } from 'src/app/common/LocaleRes';
import {Component, OnDestroy, OnInit} from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs/index";

import { AdminGroupService } from "../../../../services/admin.module/admin.group/AdminGroup.service";

@Component({
    selector: 'admin-group-reports',
    templateUrl: './admin.group.reports.html',
    styleUrls: ['./admin.group.reports.css']
})
export class AdminGroupReportsComponent implements OnInit, OnDestroy {
    public errors: any[] = [];
    public runModesLoading: boolean;
    private urlParamsSubscription: Subscription;
    private groupId: string | number;

    public runModePermissions: any[] = [];
    private initCurrModePermissions: any[];
    public currRunMode: any;

    public editMode: boolean = false;

    constructor(private adminGroupService: AdminGroupService,
                private activatedRoute: ActivatedRoute,
                private router: Router) {

        this.urlParamsSubscription = this.activatedRoute.parent.params.subscribe(
            (params: any) => {
                this.groupId = params['id'];
            },
            (error: any) => {
                this.errors = [error];
            }
        );
    }

    ngOnInit() {
        this.initRunModes();
    }

    ngOnDestroy() {
        this.urlParamsSubscription.unsubscribe();
    }

    private initRunModes() {
        this.runModesLoading = true;

        let runModePermissions: any[] = [];
        this.adminGroupService
            .getDefaultReportPermissions(this.groupId)
            .subscribe(
                (def_report_permissions: any[]) => {
                    runModePermissions.push({
                        Id: 'defMode',
                        Name: AppLocalization.ManualReportingStartMode,
                        Permissions: def_report_permissions
                    });

                    this.adminGroupService
                        .getScheduleReportPermissions(this.groupId)
                        .subscribe(
                            (schedule_report_permissions: any[]) => {
                                runModePermissions.push({
                                    Id: 'scheduleMode',
                                    Name: AppLocalization.ScheduleReportingMode,
                                    Permissions: schedule_report_permissions
                                });
                                this.runModePermissions = runModePermissions;

                                this.currRunMode = this.runModePermissions[0];
                                this.runModesLoading = false;
                            },
                            (error: any) => {
                                this.errors = [error];
                                this.runModesLoading = false;
                            });
                },
                (error: any) => {
                    this.errors = [error];
                    this.runModesLoading = false;
                });
    }

    public changeCurrModePermissions() {
        this.editMode = true;

        let cloneModePermissions: any = (runModePermissions: any[]) => {
            let runModePermissionsClone: any[] = [];

            runModePermissions.forEach((item: any) => {
                let itemClone: any = { ... item };
                runModePermissionsClone.push(itemClone);
            });

            return runModePermissionsClone;
        };

        this.initCurrModePermissions = cloneModePermissions(this.currRunMode.Permissions);
    }

    public saveCurrModePermissionsChanges() {
        this.runModesLoading = true;
        this.editMode = false;

        this.adminGroupService
            [this.currRunMode.Id == 'defMode' ? 'postDefaultReportPermissions' : 'postScheduleReportPermissions'](this.groupId, this.currRunMode.Permissions)
            .then((response: any) => {
                this.runModesLoading = false;
            })
            .catch((error: any) => {
                this.errors = [error];
                this.runModesLoading = false;
            });
    }

    public cancelCurrModePermissionsChanges() {
        this.currRunMode.Permissions = this.initCurrModePermissions;

        this.editMode = false;
    }

    public onRunModeClick(event: any) {
        if (!this.editMode) {
            this.currRunMode = event['Data'];
        }
    }
}