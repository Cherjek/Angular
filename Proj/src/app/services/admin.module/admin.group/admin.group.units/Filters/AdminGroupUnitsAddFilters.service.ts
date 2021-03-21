import { Injectable } from "@angular/core";
import { WebService } from "../../../../common/Data.service";

import * as DateRangeModule from '../../../../../common/models/Filter/DateRange';
import DateRange = DateRangeModule.Common.Models.Filter.DateRange;

import {Observable, Observer} from "rxjs/index";

@Injectable()
export class AdminGroupUnitsAddFiltersService extends WebService<any> {
    URL: string = "admin/group/units/filters/new";
}