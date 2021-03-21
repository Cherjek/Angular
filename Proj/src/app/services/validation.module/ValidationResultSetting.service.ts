import { Injectable } from "@angular/core";
import { WebService } from "../common/Data.service";
import * as Models from './Models/DataValidationCreateJobSetting';

import DataValidationCreateSetting = Models.Services.ValidationModule.Models.DataValidationCreateSetting;

@Injectable()
export class ValidationResultSettingService extends WebService<DataValidationCreateSetting> {
    URL: string = "validation/result/settings";
}