import { Component, Input, OnInit, TemplateRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { IDetailsComponent } from "../../../../../controls/ListComponentCommon/DetailsRow/IDetailsComponent";

import { ActivatedRoute } from "@angular/router";

import { RelatedDevicesService } from "../../../../../services/objecteditors.module/object.editor/oe.logicdevices/RelatedDevices.service";

@Component({
    selector: 'logicdevice-devices',
    templateUrl: 'ld.devices.html',
    styleUrls: ['ld.devices.css'],
    providers: [RelatedDevicesService]
})
export class LDDevicesComponent implements IDetailsComponent, OnInit {

    constructor(
        public activatedRoute: ActivatedRoute,
        public provider: RelatedDevicesService) {
    }

    @Input() parentKey: any;
    @Input() unitId: number;
    @Output() onLoadEnded = new EventEmitter<boolean>();

    data: any;
    params: any;
    dataSource: any[] = [];

    public errors: any[] = [];

    ngOnInit(): void {
        this.unitId = this.unitId || this.params["unitId"];

        this.provider.get(this.parentKey).subscribe(
            (data: any[]) => {
                this.dataSource = data;
                this.onLoadEnded.emit(true);
            },
            (error: any) => {
                this.errors.push(error);
                this.onLoadEnded.emit(true);
            });
    }
}