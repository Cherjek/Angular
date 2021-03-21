import { Component } from '@angular/core';
import { Common } from 'src/app/common/Constants';
import { ImportReferenceService } from 'src/app/services/import-export/references/import-reference.service';
import { Router } from '@angular/router';
import { ImportRequest } from 'src/app/services/import-export/models/ImportRequest';
import { ImportEntity } from 'src/app/services/import-export/models/ImportEntity';
import { ListView } from 'src/app/controls/ListView/ListView';

@Component({
  selector: 'rom-import-references',
  templateUrl: './import-references.component.html',
  styleUrls: ['./import-references.component.less']
})
export class ImportReferencesComponent {
  groups: any[] = [];
  loadingContentPanel = true;
  errors: any[] = [];
  rawImportGroups = {};
  saveSuccess = false;
  allGroupsNotEmpty = true;
  constructor(
    private importService: ImportReferenceService,
    private router: Router
  ) {
    const correctRedirect =
      this.router.getCurrentNavigation() &&
      this.router.getCurrentNavigation().extras.state;
    if (correctRedirect) {
      const data = correctRedirect.data;
      if (data) {
        this.initProcess(data);
      }
    } else {
      this.router.navigate(['/import-export/references/ref-upload']);
    }
    this.groups = [];
    const common = new Common.Constants();
    common.ReferenceGroups.map(group => this.groups.push({ ...group }));
  }

  initProcess(data: any) {
    this.rawImportGroups = data;
    this.parseData(data);
  }

  private parseData(data: any) {
    this.importService
      .parse(data)
      .then((result: ImportEntity[]) => {
        this.mapImportGroupsToMainGroup(result);
        this.loadingContentPanel = false;
      })
      .catch(err => this.postCallback(err));
  }

  saveRefs() {
    this.loadingContentPanel = true;
    if (this.allGroupsNotEmpty) {
      const request = new ImportRequest();
      request.value = JSON.stringify(this.rawImportGroups);
      request.importEntities = this.mapMainGroupToImport();
      this.importService
        .post(request)
        .then(_ => this.postCallback())
        .catch(x => this.postCallback(x));
    }
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
      ((undoData[undoData.length - 1]) || {}).Index,
      0,
      undoData.pop().Data
    );
    group.data = groupClone;
    this.checkIsEmpty();
  }

  removeGroupItem(item: any, group: any) {
    this.addToUndo(group, item);
    item = item.Data;
    if (group.data.length) {
      group.data = group.data.filter(
        (x: any) => x.Code !== item.Code
      );
    }
    this.checkIsEmpty();
  }

  removeAllGroupItems(group: any, listView: ListView) {
    const filterItems: any[] = [];

    listView.DataSource.forEach((item, index) => {
      if (!item.IsCheck) {
        filterItems.push(item.Data);
      } else {
        this.addToUndo(group, item);
      }
    });
    group.data = filterItems;
    this.checkIsEmpty();
  }

  private addToUndo(group: any, item: any) {
    if (!group.undoData) {
      group.undoData = [];
    }
    group.undoData.push(item);
  }

  private postCallback(err: any = null) {
    this.loadingContentPanel = false;
    if (err) {
      this.errors = [err];
    } else {
      this.saveSuccess = true;
    }
  }

  private checkIsEmpty() {
    this.allGroupsNotEmpty = this.groups.some(group => {
      if (group.data && group.data.length) {
        return true;
      }
      return false;
    });
  }

  private mapMainGroupToImport() {
    const result: ImportEntity[] = [];
    this.groups.forEach(group => {
      if (group.data && group.data.length) {
        const importEntity = new ImportEntity();
        importEntity.EntityType = group.Code;
        importEntity.Entities = group.data;
        result.push(importEntity);
      }
    });
    return result;
  }

  private mapImportGroupsToMainGroup(importGroupsData: ImportEntity[]) {
    const getGroupData = (group: any) => {
      let mappedData;
      (importGroupsData || []).find(obj => {
        if (obj) {
          if (obj.EntityType === group.Code) {
            mappedData = obj.Entities;
            return true;
          }
        }
      });
      return mappedData;
    };
    this.groups.map(group => {
      const res = getGroupData(group);
      if (res) {
        (group as any).data = res;
      }
    });
  }
}
