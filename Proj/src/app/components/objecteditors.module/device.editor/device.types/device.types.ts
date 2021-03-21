import { Component, OnInit, OnDestroy } from '@angular/core';
import { DeviceTypesService } from "../../../../services/objecteditors.module/device.editor/device.types/device.types.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs/index";

@Component({
  selector: 'device-types',
  templateUrl: './device.types.html',
  styleUrls: ['./device.types.css']
})
export class DeviceTypesComponent implements OnInit, OnDestroy {
    deviceTypes: any[];
    errors: any[] = [];
    loadingContent: boolean = true;
    unitId: number;
    returnToLD: boolean;//������� �������� � ����� �������� ������������, ���������� ������ ����������

    subscription: Subscription;
    data$: Subscription;

    constructor(public deviceTypesService: DeviceTypesService,
                public router: Router,
                public activatedRoute: ActivatedRoute) {
        this.subscription = this.activatedRoute.queryParams.subscribe((params: any) => {
            this.unitId = params['unitId'];
            this.returnToLD = params['returnToLD'];
        });
    }

    ngOnInit() {
        this.data$ = this.deviceTypesService.get().subscribe(
            (types: any[]) => {
                this.loadingContent = false;
                this.deviceTypes = types;
            },
            (error: any) => {
                this.loadingContent = false;
                this.errors.push(error.Message);
            }
        );
    }

    ngOnDestroy() {
        this.unsubscriber([this.subscription, this.data$]);
    }

    unsubscriber(subs: Subscription[]) {
        subs.forEach(sub => {
            if (sub) { sub.unsubscribe(); }
        });
    }

    onItemClick(event: any) {
        this.router.navigate(['../properties'],
            {
                relativeTo: this.activatedRoute,
                queryParams: { unitId: this.unitId, deviceName: JSON.stringify(event.Data), returnToLD: this.returnToLD },
            });
    }

}
