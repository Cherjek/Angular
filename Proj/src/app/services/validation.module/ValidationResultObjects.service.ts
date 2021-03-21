import { Injectable } from "@angular/core";
import { WebService } from "../common/Data.service";
import { ObjectTable } from "../common/Models/ObjectTable";

@Injectable()
export class ValidationResultObjectsService extends WebService<ObjectTable> {
    URL: string = "validation/result/objects";
}