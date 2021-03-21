import { Component, OnInit, OnDestroy } from '@angular/core';
import { DeviceChannelTypesService } from 'src/app/services/references/device-channel-types.service';
import { GeographyService } from 'src/app/services/references/geography.service';
import { DataQueryTypesService } from 'src/app/services/references/data-query-types.service';
import { DataQuerySettingsService } from 'src/app/services/data-query';
import { LogicDeviceTypesService } from 'src/app/services/configuration/logic-device-types.service';
import { DevicePropertyTypesService } from 'src/app/services/references/device-property-types.service';
import { LogicDevicePropertyTypesService } from 'src/app/services/references/logic-device-property-types.service';
import { LogicTagTypesService } from 'src/app/services/references/logic-tag-types.service';
import { ReferenceDeviceCommandTypesService } from 'src/app/services/commands/Reference/reference-device-command-types.service';
import { ConfigCommandDeviceTypesService } from 'src/app/services/commands/Configuration/DeviceLogicTypesCommandService.service';
import { Subscription } from 'rxjs';
import { ExportReferenceService } from 'src/app/services/import-export/references/export-reference.service';
import { Common } from 'src/app/common/Constants';
import { DropDownBox } from 'src/app/controls/DropDownBox/DropDownBox';
import { ListView } from 'src/app/controls/ListView/ListView';

@Component({
  selector: 'rom-export-references',
  templateUrl: './export-references.component.html',
  styleUrls: ['./export-references.component.less']
})
export class ExportReferencesComponent implements OnInit, OnDestroy {
  groups: any[] = [];
  loadingContentPanel = true;
  errors: any[] = [];
  dropdownData: any;
  servs: any[];
  servsSub$: Subscription;
  export$: Subscription;
  exportObject: any = {};
  constructor(
    private geographyService: GeographyService,
    private typesRequestService: DataQueryTypesService,
    private deviceChannelService: DeviceChannelTypesService,
    private devicePropertyTypesService: DevicePropertyTypesService,
    private logicDevicePropTypesService: LogicDevicePropertyTypesService,
    private logicTagTypes: LogicTagTypesService,
    private refDeviceCommandTypes: ReferenceDeviceCommandTypesService,
    private logicDeviceCommandTypes: ConfigCommandDeviceTypesService,
    private devicePropertyTypes: DataQuerySettingsService,
    private logicDeviceTypesService: LogicDeviceTypesService,
    private exportRefService: ExportReferenceService
  ) {
    this.servs = [
      { code: 'MacroRegions', service: this.geographyService.get() },
      { code: 'DataQueryTypes', service: this.typesRequestService.read() },
      { code: 'DeviceChannelTypes', service: this.deviceChannelService.read() },
      {
        code: 'DevicePropertyTypes',
        service: this.devicePropertyTypesService.read()
      },
      {
        code: 'LogicDevicePropertyTypes',
        service: this.logicDevicePropTypesService.read()
      },
      { code: 'LogicTagTypes', service: this.logicTagTypes.read() },
      {
        code: 'DeviceCommandTypes',
        service: this.refDeviceCommandTypes.read()
      },
      {
        code: 'LogicDeviceCommandTypes',
        service: this.logicDeviceCommandTypes.get()
      },
      {
        code: 'DeviceTypes',
        service: this.devicePropertyTypes.getDeviceTypes()
      },
      { code: 'LogicDeviceTypes', service: this.logicDeviceTypesService.get() }
    ] as any;

    this.groups = [];
    const common = new Common.Constants();
    common.ReferenceGroups.map(group => this.groups.push({ ...group }));
  }

  ngOnInit() {
    this.loadingContentPanel = false;
  }

  ngOnDestroy() {
    this.unsubscriber([this.servsSub$]);
  }

  loadDropdownData(group: any) {
    this.servsSub$ = this.servs
      .find(groupType => group.Code === groupType.code)
      .service.subscribe((data: any) => this.constructDropdown(data, group));
  }

  private constructDropdown(data: any, group: any) {
    group.references = data;
    group.valueField = group.Name === this.groups[0].Name ? 'Name' : 'Code';
    group.additionalField = 'Name';
  }

  cacheCallback(group: any, dropdownBoxTags: DropDownBox) {}

  addSelectedTags(group: any, selectedRows: any) {
    group.data = selectedRows;
    this.exportObject[group.Code] = [...selectedRows]
      .filter(function({ Id }) {
        return !this[Id] && (this[Id] = Id);
      }, {})
      .map(({ Id }: any) => Id);
  }

  exportIds() {
    this.loadingContentPanel = true;
    if (Object.keys(this.exportObject).length) {
      Object.keys(this.exportObject).forEach(obj => {
        this.exportObject[obj] = this.exportObject[obj]
            .map((x: any) => isNaN(x) ? x.Id : x);
      });
      this.exportRefService
        .post(this.exportObject)
        .then((result: any) => {
          this.createJsonFile(result);
          this.loadingContentPanel = false;
        })
        .catch(err => console.log(err));
    }
  }

  private createJsonFile(result: any) {
    const blob = new Blob([result], { type: 'application/json' });
    this.downloadFile(blob);
  }

  private downloadFile(blob: Blob) {
    const url = window.URL.createObjectURL(blob);
    const tempLink = document.createElement('a');
    document.body.appendChild(tempLink);
    tempLink.setAttribute('style', 'display: none');
    tempLink.href = url;
    tempLink.download = `ROM-${this.getCurrentDate()}`;
    tempLink.click();
    window.URL.revokeObjectURL(url);
    tempLink.remove();
  }

  private getCurrentDate() {
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const time = date
      .toTimeString()
      .split(' ')[0]
      .split(':')
      .join('_');
    return day + '_' + month + '_' + year + '___' + time;
  }

  removeGroupItem(item: any, group: any) {
    this.addToUndo(group, item);
    item = item.Data;
    group.data = this.exportObject[group.Code] = (group.data || []).filter(
      ({ Id }: any) => {
        if (item && Id) {
          return Id !== item.Id;
        }
      }
    );
    this.checkEmptyExportsItems();
  }

  private addToUndo(group: any, item: any) {
    if (!group.undoData) {
      group.undoData = [];
    }
    group.undoData.push(item);
  }

  undoItemDelete(group: any) {
    const groupClone: any[] = [];
    (group.data || []).forEach((dataGroup: any) => {
      if (dataGroup) {
        groupClone.push({ ...dataGroup });
      }
    });
    const undoData: any[] = group.undoData || [];

    (groupClone || []).splice(
      (undoData[undoData.length - 1] || {}).Index,
      0,
      undoData.pop().Data
    );
    this.exportObject[group.Code] = groupClone;
    group.data = groupClone;
  }

  removeAllGroupItems(group: any, listView: ListView) {
    const filterItems: any[] = [];

    listView.DataSource.forEach(item => {
      if (!item.IsCheck) {
        filterItems.push(item.Data);
      } else {
        this.addToUndo(group, item);
      }
    });
    group.data = this.exportObject[group.Code] = filterItems;
    this.checkEmptyExportsItems();
  }

  private checkEmptyExportsItems() {
    Object.keys(this.exportObject).forEach(
      group =>
        !this.exportObject[group].length && delete this.exportObject[group]
    );
  }

  private unsubscriber(subs: Subscription[]) {
    subs.forEach(sub => {
      if (sub) {
        sub.unsubscribe();
      }
    });
  }
}
