﻿import { Component, Input, OnInit, TemplateRef, ViewChild, Output, EventEmitter } from '@angular/core';
﻿import { IDetailsComponent } from "../../../controls/ListComponentCommon/DetailsRow/IDetailsComponent";

import { PropertiesService } from "../../../services/common/Properties.service";

﻿@Component({
﻿     selector: 'properties-panel',
     templateUrl: './properties.panel.html',
     styleUrls: ['./properties.panel.css'],
     providers: [ PropertiesService ]
﻿})
export class PropertiesPanelComponent implements IDetailsComponent, OnInit {
    constructor(public provider: PropertiesService) {}

     @Input() parentKey: any;
     @Input() params: any;
     data: any;

     @Output() onLoadEnded = new EventEmitter<boolean>();

     // itemWidthInPercs: number = 30;

     dataSource: any;

     public errors: any[] = [];

     ngOnInit(): void {
         this.provider.getProperties(this.parentKey, this.params).subscribe(
             data => {
                 this.dataSource = data;
                 this.onLoadEnded.emit(true);
             },
             (error) => {
                 this.errors.push(error);
                 this.onLoadEnded.emit(true);
             });
     }

     /*getItemWidth(order: number): number {
         let amtByRow: number = Math.floor(100 / this.itemWidthInPercs);

         if (order % amtByRow == 0) {
             return (100 - (amtByRow - 1) * this.itemWidthInPercs);
         } else {
             return this.itemWidthInPercs;
         }
     }

     getBorder(order: number): string {
         let amtByRow: number = Math.floor(100 / this.itemWidthInPercs);
         let rowNumber: number = (order % amtByRow == 0) ? (order / amtByRow) : (Math.floor(order / amtByRow) + 1);
         let lastRowNumber: number = (this.data.length % amtByRow == 0) ? (this.data.length / amtByRow) : (Math.floor(this.data.length / amtByRow) + 1);

         if (rowNumber == lastRowNumber) {
             return '0px';
         } else {
             return '1px solid #D3D8E1';
         }
     }*/
}