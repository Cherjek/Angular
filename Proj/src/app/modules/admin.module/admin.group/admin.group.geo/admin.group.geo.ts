import { Component, OnInit, OnDestroy, ViewChild, HostListener } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs/index";

import { AdminGroupGeoService } from "../../../../services/admin.module/admin.group/AdminGroupGeo.service";

import * as RU from "../../../../common/Constants";
import Constant = RU.Common.Constants;

@Component({
    selector: 'app-admin.group.geo',
    templateUrl: './admin.group.geo.html',
    styleUrls: ['./admin.group.geo.css'],
    providers: [AdminGroupGeoService]
})
export class AdminGroupGeoComponent implements OnInit, OnDestroy {

    public __search: string;
    public errors: any[] = [];
    public loadingContentPanel: boolean;

    private urlParamsSubscribe: Subscription;
    private groupId: string | number;

    public geoTree: any;

    constructor(public adminGroupGeoService: AdminGroupGeoService,
        public activatedRoute: ActivatedRoute,
        public router: Router) {

        this.urlParamsSubscribe = this.activatedRoute.parent.params.subscribe(
            params => {
                this.groupId = params['id'];

                //разобраться, почему не работает запуск конструктора заново, при смене new на id группы
                this.loadGroupGeo();
            }
        );
    }

    ngOnInit() {
        
    }

    ngOnDestroy(): void {
        this.urlParamsSubscribe.unsubscribe();
    }

    @HostListener('document:keydown', ['$event']) onKeyDownFilter(event: KeyboardEvent) {
        if (event.ctrlKey) {
            //Ctrl + s = save
            if (event.keyCode === 83) {
                event.preventDefault();
                
            }
        }
    }

    loadGroupGeo() {

        this.loadingContentPanel = true;

        this.adminGroupGeoService
            .getGeoPermissions(<number>this.groupId)
            .subscribe((geo: any[]) => {
                    this.loadingContentPanel = false;
                    this.geoTree = geo;
                },
            (error: any) => {
                this.loadingContentPanel = false;
                this.errors = [error];
            });
    }

    changeGeo() {
        this.router.navigate([`/admin/group/${this.groupId}/geo-edit`]);
    }
}
