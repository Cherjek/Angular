import { Injectable } from "@angular/core";
import { WebService } from "../common/Data.service";

@Injectable()
export class ValidationResultDataService extends WebService<any> {
    URL: string = "validation/result/data";
}