import { EventEmitter } from "@angular/core";

export interface IDetailsComponent  {
    parentKey: any;
    data: any;
    params: any;
    onLoadEnded: EventEmitter<boolean>;
}