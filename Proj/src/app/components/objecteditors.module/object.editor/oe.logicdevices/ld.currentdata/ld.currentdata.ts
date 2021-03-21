import { Component, Input, OnInit, TemplateRef, ViewChild, Output, EventEmitter } from '@angular/core';
﻿import { IDetailsComponent } from "../../../../../controls/ListComponentCommon/DetailsRow/IDetailsComponent";

import { IDataService } from "../../../../../services/common/Data.service";

﻿@Component({
﻿     selector: 'logicdevice-currentdata',
     templateUrl: 'ld.currentdata.html',
     styleUrls: ['ld.currentdata.css']
﻿})
export class LDCurrentDataComponent implements IDetailsComponent, OnInit {

     @Input() parentKey: any;
     @Input() provider: IDataService<any>;
     @Output() onLoadEnded = new EventEmitter<boolean>();

     data: any;
     params: any;

     public errors: any[] = [];

     ngOnInit(): void {
         this.provider.get(this.parentKey).subscribe(
             data => {
                 this.data = data;
                 this.onLoadEnded.emit(true);
             },
             (error) => {
                 this.errors.push(error);
                 this.onLoadEnded.emit(true);
             });
     }
}