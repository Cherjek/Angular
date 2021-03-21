import { Component, Input, OnInit, TemplateRef, ViewChild, Output, EventEmitter } from '@angular/core';
﻿import { IDetailsComponent } from "../../../../../controls/ListComponentCommon/DetailsRow/IDetailsComponent";

import { IDataService } from "../../../../../services/common/Data.service";

import { RelatedLogicDevicesService } from "../../../../../services/objecteditors.module/object.editor/oe.devices/RelatedLogicDevices.services";

﻿@Component({
﻿     selector: 'device-logicdevices',
     templateUrl: 'd.logicdevices.html',
     styleUrls: ['d.logicdevices.css'],
     providers: [ RelatedLogicDevicesService ]
﻿})
export class DLogicDevicesComponent implements IDetailsComponent, OnInit {
     constructor(public provider: RelatedLogicDevicesService) {}

     @Input() parentKey: any;
     data: any;
     params: any;
     @Output() onLoadEnded = new EventEmitter<boolean>();

     private unitId: number;

     dataSource: any[] = [];

     public errors: any[] = [];

     ngOnInit(): void {

         this.unitId = this.params["unitId"];

         this.provider.get(this.parentKey).subscribe(
             data => {
                 this.dataSource = data;
                 this.onLoadEnded.emit(true);
             },
             (error) => {
                 this.errors.push(error);
                 this.onLoadEnded.emit(true);
             });
     }
}