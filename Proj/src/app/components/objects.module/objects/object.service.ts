import { Injectable } from '@angular/core';

import { GlobalValues } from '../../../core';

import { UnitStatusesService } from '../../../services/objects.module/Units/UnitStatuses.service';
import { LDStatusesService } from '../../../services/objects.module/LogicDevices/LDStatuses.service';

import { UnitMapService } from '../../../services/objects.module/Units/UnitMap.service';
import { LDMapService } from '../../../services/objects.module/LogicDevices/LDMap.service';

import { WebService } from "../../../services/common/Data.service";

enum TabPage { Units, LogicDevice }

@Injectable()
export class ObjectInjectService {

    constructor(
        private untStService: UnitStatusesService,
        private ldStService: LDStatusesService,
        private untMapService: UnitMapService,
        private ldMapService: LDMapService) { }

    private getCurrentTab(): TabPage {
        if ((GlobalValues.Instance.Navigate.selectItem || { code: undefined }).code === "units") {
            return TabPage.Units;
        } else {
            return TabPage.LogicDevice;
        }
    }
    get statuses(): WebService<any> {
        if (this.getCurrentTab() === TabPage.Units)
            return this.untStService;
        else
            return this.ldStService;
    }
    get map(): WebService<any> {
        if (this.getCurrentTab() === TabPage.Units)
            return this.untMapService;
        else
            return this.ldMapService;
    }
}