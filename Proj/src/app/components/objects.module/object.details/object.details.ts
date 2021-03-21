import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ComponentFactoryResolver } from '@angular/core';

import { ObjDetailsMap } from './Components/obj.details.map';

enum Tabs { Properties, Map }

@Component({
    selector: 'object-details',
    templateUrl: 'object.details.html',
    styleUrls: ['object.details.css']
})

export class ObjectDetails {
    Tabs = Tabs;

    constructor() { }

    @Input() Parent: any;
    @Input() Key: any;
    @Output() onDataLoad = new EventEmitter<boolean>();

    wasAlreadyClicked: boolean[] = [true, false];
    isNowClicked: boolean[] = [true, false];

    loadTab(tab: Tabs) {
        switch (tab) {
            case Tabs.Properties:
                if (!this.wasAlreadyClicked[Tabs.Properties]) {
                    this.wasAlreadyClicked[Tabs.Properties] = true;
                }
                this.isNowClicked = this.isNowClicked.map((elem, index) => {
                    if (index == Tabs.Properties) {
                        elem = true;
                    } else {
                        elem = false;
                    }
                    return elem;
                });
                break;
            case Tabs.Map:
                if (!this.wasAlreadyClicked[Tabs.Map]) { this.wasAlreadyClicked[Tabs.Map] = true; }
                this.isNowClicked = this.isNowClicked.map((elem, index) => {
                    if (index == Tabs.Map) {
                        elem = true;
                    } else {
                        elem = false;
                    }
                    return elem;
                });
                break;
        }
    }
}
