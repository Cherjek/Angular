import { Injectable } from "@angular/core";
import { WebService } from "../common/Data.service";
import * as Models from './Models/DataValidationCreateJobSetting';

import DataValidationCreateSetting = Models.Services.ValidationModule.Models.DataValidationCreateSetting;

@Injectable()
export class ValidationCreateSettingService extends WebService<DataValidationCreateSetting> {
    URL: string = "validation/create";
    create(setting: DataValidationCreateSetting): any {
        return this.post(setting);
    }
}