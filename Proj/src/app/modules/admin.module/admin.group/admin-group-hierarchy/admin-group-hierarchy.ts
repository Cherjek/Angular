import {Component, OnDestroy, OnInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { AdminGroupService } from '../../../../services/admin.module/admin.group/AdminGroup.service';
import { IHierarchyPermissionView } from '../../../../services/admin.module/admin.group/Models/HierarchyPermissionView';

@Component({
    selector: 'admin-group-hierarchy',
    templateUrl: './admin-group-hierarchy.html',
    styleUrls: ['./admin-group-hierarchy.css']
})
export class AdminGroupHierarchyComponent implements OnInit, OnDestroy {
    public errors: any[] = [];
    public runModesLoading: boolean;
    private urlParamsSubscription: Subscription;
    private groupId: number;

    private runModePermissions: any[] = [];
    private initCurrModePermissions: any[];
    private currRunMode: any;

    public editMode: boolean = false;

    private hierarchies: IHierarchyPermissionView[];
    public hierarchiesEdit: IHierarchyPermissionView[];

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

        this.adminGroupService
            .getHierarchies(this.groupId)
            .pipe(
                finalize(() => this.runModesLoading = false)
            )
            .subscribe(
                (hierarchies: IHierarchyPermissionView[]) => {
                    this.hierarchies = hierarchies;
                    this.hierarchiesEdit = this.cloneCurrentData();
                },
                (error: any) => {
                    this.errors = [error];
                });
    }

    private cloneCurrentData() {
        return this.hierarchies.map(h => ({...h}));
    }

    public changeCurrModePermissions() {
        this.editMode = true;
    }

    public saveCurrModePermissionsChanges() {
        this.runModesLoading = true;

        this.adminGroupService
            .postHierarchies(this.groupId, this.hierarchiesEdit)
            .then((response: any) => {
                this.editMode = false;
                this.initRunModes();
            })
            .catch((error: any) => {
                this.errors = [error];
                this.runModesLoading = false;
            });
    }

    public cancelCurrModePermissionsChanges() {
        this.hierarchiesEdit = this.cloneCurrentData();

        this.editMode = false;
    }
}