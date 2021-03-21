import { Injectable } from "@angular/core";
import { WebService } from "../common/Data.service";

@Injectable()
export class ValidationResultInfoService extends WebService<any> {
    URL: string = "validation/result/info";
}