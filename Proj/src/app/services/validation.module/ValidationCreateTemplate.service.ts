import { Injectable } from "@angular/core";
import { WebService } from "../common/Data.service";

import { Observable, Observer } from "rxjs";

@Injectable()
export class ValidationCreateTemplateService extends WebService<any> {
    URL: string = "validation/create/template";
}