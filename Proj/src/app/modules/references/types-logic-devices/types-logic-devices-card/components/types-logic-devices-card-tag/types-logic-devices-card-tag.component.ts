import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LogicDeviceTagTypesService } from 'src/app/services/references/logic-device-tag-types.service';
import { LogicDeviceTagGroupsService } from 'src/app/services/references/logic-device-tag-groups.service';
import { LogicDeviceTagGroups } from 'src/app/services/references/models/LogicDeviceTagGroups';
import { forkJoin, Observable } from 'rxjs';
import { LogicDeviceTagTypes } from 'src/app/services/references/models/LogicDeviceTagTypes';
// import { LogicTagTypesService } from 'src/app/services/references/logic-tag-types.service';
import {
  FilterValue,
  FilterOperationType
} from 'src/app/common/models/Filter/FilterValue';
import { LogicTagTypes } from 'src/app/services/references/models/LogicTagTypes';
import { finalize } from 'rxjs/operators';
import { AppLocalization } from 'src/app/common/LocaleRes';

@Component({
  selector: 'rom-types-logic-devices-card-tag',
  templateUrl: './types-logic-devices-card-tag.component.html',
  styleUrls: ['./types-logic-devices-card-tag.component.less']
})
export class TypesLogicDevicesCardTagComponent implements OnInit {
  groups: LogicDeviceTagGroups[];
  tags: LogicTagTypes[];
  loadingContentPanel: boolean;
  errors: any[] = [];
  logicDeviceId: number;

  filterValue = new FilterValue(-1, FilterOperationType.NotEqual);

  constructor(
    private activatedRoute: ActivatedRoute,
    private logicDeviceTagTypesServ: LogicDeviceTagTypesService,
    // private tagTypesServ: LogicTagTypesService,
    private groupsServ: LogicDeviceTagGroupsService
  ) {
    const params = this.activatedRoute.parent.snapshot.params;
    groupsServ.params = params;
    this.logicDeviceId = params.id;
    logicDeviceTagTypesServ.logicDeviceId = params.id;
  }

  filterTable = {};

  ngOnInit() {
    this.loadingContentPanel = true;
    this.initData();
  }

  private initData() {
    const servs = {
      logicDeviceTagTypes: this.logicDeviceTagTypesServ.get(),
      tagTypes: this.logicDeviceTagTypesServ.getLogicTagTypes(),
      groups: this.logicDeviceTagTypesServ.getGroups()
    };
    forkJoin(servs)
      .pipe(finalize(() => this.loadingContentPanel = false))
      .subscribe((data: DataSourceType) => {
        this.createGroups(data);
      }, err => this.errors = [err]);
  }

  private createGroups(data: DataSourceType) {
    const noNameGroup = new LogicDeviceTagGroups();
    noNameGroup.Id = -1;
    noNameGroup.Name = AppLocalization.Common;
    noNameGroup.IdLogicDeviceType = this.logicDeviceId;
    noNameGroup.tags = [];
    const logicDeviceTypesObject = {}; // contains LogicDeviceTypes grouped using TagGroup Id as keys
    data.logicDeviceTagTypes.forEach((tagType: LogicDeviceTagTypes) => {
      if (tagType.TagGroup) {
        logicDeviceTypesObject[
          tagType.TagGroup.Id
        ] = data.logicDeviceTagTypes.filter((tagGroup: LogicDeviceTagTypes) => {
          if (tagGroup.TagGroup) {
            return tagGroup.TagGroup.Id === tagType.TagGroup.Id;
          }
        });
      } else {
        noNameGroup.tags.push(tagType);
      }
    });
    this.createGroupTags(data, logicDeviceTypesObject, noNameGroup);
  }

  private createGroupTags(
    data: DataSourceType,
    logicDeviceTypesObject: {},
    noNameGroup: LogicDeviceTagGroups
  ) {
    const hasNameGroups = data.groups.map((group: LogicDeviceTagGroups) => {
      group.tags = logicDeviceTypesObject[group.Id];
      return group;
    });
    this.groups = [noNameGroup, ...hasNameGroups];
    const logicTagTypesIds: number[] = [];
    (this.groups || []).forEach(group => {
      if (group) {
        (group.tags || []).forEach(tag => {
          logicTagTypesIds.push((tag.LogicTagType || { Id: undefined }).Id);
        });
      }
    });
    this.tags = data.tagTypes.filter(
      tagType => !logicTagTypesIds.find(id => tagType.Id === id)
    );
    this.createGroupDropdownFilter();
  }

  private createGroupDropdownFilter() {
    this.groups.forEach(g => {
      this.filterTable[g.Id] = {
        Id: [new FilterValue(g.Id, FilterOperationType.NotEqual)]
      };
    });
    this.loadingContentPanel = false;
  }

  deleteItem(items: LogicDeviceTagTypes[]) {
    if (items && items.length) {
      this.loadingContentPanel = true;
      this.logicDeviceTagTypesServ
        .delete(items)
        .then(x => {
          this.initData();
        })
        .catch(err => {
          this.errors = [err];
          this.loadingContentPanel = false;
        });
    }
  }

  moveToGroup(
    group: LogicDeviceTagGroups,
    selectedItems: LogicDeviceTagTypes[]
  ) {
    this.postData(group, selectedItems, null);
  }

  addSelectedTags(group: LogicDeviceTagGroups, selectedTags: LogicTagTypes[]) {
    this.postData(group, null, selectedTags);
  }

  private postData(
    group: LogicDeviceTagGroups,
    selectedItems?: LogicDeviceTagTypes[],
    selectedTags?: LogicTagTypes[]
  ) {
    this.loadingContentPanel = true;
    let promise: Promise<any>;

    let logDeviceTagTypes: LogicDeviceTagTypes[];
    group = {
      Id: group.Id,
      IdLogicDeviceType: group.IdLogicDeviceType,
      Name: group.Name,
      OrderNum: group.OrderNum
    };
    if (selectedItems) {
      logDeviceTagTypes = selectedItems.map((tag: LogicDeviceTagTypes) => {
        if (group.Id === -1) {
          tag.TagGroup = null;
        } else {
          tag.TagGroup = group;
        }
        return tag;
      });

      promise = this.logicDeviceTagTypesServ.update(logDeviceTagTypes);
    } else if (selectedTags) {
      logDeviceTagTypes = selectedTags.map((tag: LogicTagTypes) => {
        const logicDevType = new LogicDeviceTagTypes();
        logicDevType.IdLogicDeviceType = this.logicDeviceId;
        logicDevType.LogicTagType = tag;
        if (group.Id === -1) {
          logicDevType.TagGroup = null;
        } else {
          logicDevType.TagGroup = group;
        }
        return logicDevType;
      });

      promise = this.logicDeviceTagTypesServ.add(logDeviceTagTypes);
    }
    promise
      .then(x => {
        this.initData();
      })
      .catch(err => {
        this.errors = [err];
        this.loadingContentPanel = false;
      });
  }
}

interface DataSourceType {
  groups: LogicDeviceTagGroups[];
  logicDeviceTagTypes: LogicDeviceTagTypes[];
  tagTypes: LogicTagTypes[];
}
