import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, OnDestroy, ViewChild, HostListener, AfterContentChecked, ChangeDetectorRef } from '@angular/core';
import { TreeListItem, TreeListCheckedPanelComponent, ListTreeItem } from 'src/app/shared/rom-forms/treeList.checked.panel';
import { GeographyService } from 'src/app/services/references/geography.service';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IData } from 'src/app/services/configuration/Models/Data';

@Component({
  selector: 'rom-geo-view',
  templateUrl: './geo-view.component.html',
  styleUrls: ['./geo-view.component.less']
})
export class GeoViewComponent implements OnInit, OnDestroy, AfterContentChecked {
  errors: any[] = [];
  loadingContent = true;
  subscription$: Subscription;
  geoTree: any[];
  levelTree: number;
  listEdit: string;
  editingValue: string;
  editingItem: any;
  changeDetection: any;
  listViewPanel: any;
  firstPanelCountChecked = 0;
  secondPanelCountChecked = 0;
  thirdPanelCountChecked = 0;
  fourthPanelCountChecked = 0;
  lastChangeCheck: string;

  formValidateGroup: FormGroup;

  public treeListItems: TreeListItem[] = [
    {
      headerText: AppLocalization.Macroregion,
      childDataName: 'Regions'
    },
    {
      headerText: AppLocalization.Region,
      childDataName: 'Filials'
    },
    {
      headerText: AppLocalization.Branch,
      childDataName: 'Esos'
    },
    new TreeListItem(AppLocalization.ESO)
  ];

  @ViewChild('treelistCheckedPanel', { static: false })
  treelistCheckedPanel: TreeListCheckedPanelComponent;

  @HostListener('document:keydown', ['$event']) onKeyDownFilter(
    event: KeyboardEvent
  ) {

    if (this.levelTree || this.listEdit) {
      if (event.ctrlKey) {
        // Ctrl + s = save
        if (event.keyCode === 83) {
          this.save();
        }
      } if (event.keyCode === 13) {
        this.save();
      } else {
        if (event.keyCode === 27) {
          this.cancel();
        }
      }
    }
  }

  constructor(
    private geographyService: GeographyService,
    private _changeDetection: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.createFormGroup();
    this.loadData();
  }

  ngOnDestroy() {
    if (this.subscription$) {
      this.subscription$.unsubscribe();
    }
  }

  ngAfterContentChecked(): void {
    if (this.listViewPanel) {
      this.firstPanelCountChecked = this.listViewPanel[0] != null ? this.listViewPanel[0].isAtLeastOneSelected : 0;
      this.secondPanelCountChecked = this.listViewPanel[1] != null ? this.listViewPanel[1].isAtLeastOneSelected : 0;
      this.thirdPanelCountChecked = this.listViewPanel[2] != null ? this.listViewPanel[2].isAtLeastOneSelected : 0;
      this.fourthPanelCountChecked = this.listViewPanel[3] != null ? this.listViewPanel[3].isAtLeastOneSelected : 0;
      
      /*const change = `${this.firstPanelCountChecked}|${this.secondPanelCountChecked}|${this.thirdPanelCountChecked}|${this.fourthPanelCountChecked}`;
      if (change !== this.lastChangeCheck) {
        this.lastChangeCheck = change;
        this._changeDetection.detectChanges();
        console.log(`ngAfterContentChecked: ${this.firstPanelCountChecked} | ${this.secondPanelCountChecked} | ${this.thirdPanelCountChecked} | ${this.fourthPanelCountChecked}`);
      }*/
    }
  }

  get geoName() {
    return this.formValidateGroup.get('geoName');
  }

  createFormGroup() {
    this.formValidateGroup = new FormGroup({
      geoName: new FormControl('geoName', [
        Validators.required,
        Validators.maxLength(175)
      ])
    });
  }

  addNew(levelTree: number) {
    this.levelTree = levelTree;
  }

  edit(item: any, listView: any) {
    this.listEdit = listView.ControlId;
    this.editingItem = item.Data;
    this.editingValue = item.Data.Name;
  }

  save() {
    let levelTree = this.levelTree;
    let requestData: any;
    if (this.editingItem != null) {
      levelTree =
        this.listEdit === 'TreeList_0'
          ? 1
          : this.listEdit === 'TreeList_1'
          ? 2
          : this.listEdit === 'TreeList_2'
          ? 3
          : 4;

      requestData = this.editingItem;
    } else {
      if (levelTree === 2) {
        requestData = {
          MacroRegion: this.treelistCheckedPanel.mapSelectTreeLevel.get(0).Data
        };
      } else if (levelTree === 3) {
        requestData = {
          Region: this.treelistCheckedPanel.mapSelectTreeLevel.get(1).Data
        };
      } else if (levelTree === 4) {
        requestData = {
          Filial: this.treelistCheckedPanel.mapSelectTreeLevel.get(2).Data
        };
      }
    }
    requestData = Object.assign(requestData || {}, { Name: this.editingValue });

    this.loadingContent = true;
    let promise: Promise<any> = null;
    if (levelTree === 1) {
      promise = this.geographyService.saveMacroRegion(requestData);
    } else if (levelTree === 2) {
      promise = this.geographyService.saveRegion(requestData);
    } else if (levelTree === 3) {
      promise = this.geographyService.saveFilial(requestData);
    } else if (levelTree === 4) {
      promise = this.geographyService.saveEso(requestData);
    }
    promise
      .then((result: any) => {
        this.complete();
      })
      .catch((error: any) => {
        this.loadingContent = false;
        this.errors = [error];
      });
  }

  complete() {
    if (this.editingItem != null) {
      this.editingItem.Name = this.editingValue;
      this.loadingContent = false;
    } else {
      this.loadData(() => {
        setTimeout(() => {
          this.changeDetection = new Date().getTime().toString();
        });
      });
    }
    this.cancel();
  }

  cancel() {
    this.levelTree = null;
    this.listEdit = null;
    this.editingValue = null;
    this.editingItem = null;
  }

  itemChecked(data: any) {
    const indexPanel = data.indexPanel;
    const listViewsForm = this.treelistCheckedPanel['listViewsForm'];
    const listView = Object.values(listViewsForm)[indexPanel];
    this.listViewPanel = this.listViewPanel || {};
    this.listViewPanel[indexPanel] = listView;
    this._changeDetection.detectChanges();
  }

  remove(levelTree: number) {
    this.loadingContent = true;
    let promise: Promise<any>;
    this.errors = [];

    const level = this.treelistCheckedPanel.mapTreeLevel.get(levelTree - 1);
    const removeItems: IData[] = level.filter((x: ListTreeItem) => x.IsCheck).map(x => x.Data);
    let length = removeItems.length;
    for (let i = 0; i < length; i++) {
      if (levelTree === 1) {
        promise = this.geographyService.deleteMacroRegion(removeItems[i].Id);
      } else if (levelTree === 2) {
        promise = this.geographyService.deleteRegion(removeItems[i].Id);
      } else if (levelTree === 3) {
        promise = this.geographyService.deleteFilial(removeItems[i].Id);
      } else if (levelTree === 4) {
        promise = this.geographyService.deleteEso(removeItems[i].Id);
      }

      promise
      .then((result: any) => {
        if ((i + 1) === length) {
          this.complete();
        }
      })
      .catch((error: any) => {
        this.loadingContent = false;
        this.errors.push(`${AppLocalization.CantBeRemoved} "${removeItems[i].Name}"`);
      });
    }
  }

  private loadData(callback?: any) {
    this.subscription$ = this.geographyService
      .get()
      .pipe(finalize(() => (this.loadingContent = false)))
      .subscribe(
        (data: any[]) => {
          this.geoTree = data;
          if (callback) {
            callback();
          }
        },
        error => {
          this.errors = [error];
        }
      );
  }
}
