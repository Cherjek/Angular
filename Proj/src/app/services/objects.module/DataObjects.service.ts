import { Injectable } from "@angular/core";
import { WebService } from "../common/Data.service";
import * as Models from './Models/DataObject';

import { Observable, Observer } from "rxjs";

import ObjectData = Models.Services.ObjectsModule.Models.ObjectTableView;

@Injectable()
export class DataObjectsService extends WebService<ObjectData> {
    URL: string = "objectsui";
}