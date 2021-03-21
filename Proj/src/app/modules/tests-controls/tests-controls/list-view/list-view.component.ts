import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, ViewChild } from '@angular/core';
import { TreeListItem, TreeListCheckedPanelComponent } from 'src/app/shared/rom-forms/treeList.checked.panel';
import { GeoTree } from '../GeoTree';
import { of } from 'rxjs';
import { delay, finalize } from 'rxjs/operators';

@Component({
  selector: 'rom-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.less']
})
export class ListViewComponent implements OnInit {

  items = [{
    Id: 1,
    Name: 'List Item 1',
    Desc: 'test description',
  }, {
    Id: 2,
    Name: 'List Item 2',
    Desc: 'test description',
  }, {
    Id: 3,
    Name: 'List Item 3',
    Desc: 'test description',
  }, {
    Id: 4,
    Name: 'List Item 4',
    Desc: 'test description',
  }, {
    Id: 5,
    Name: 'List Item 5',
    Desc: 'test description',
  }, {
    Id: 6,
    Name: 'List Item 6',
    Desc: 'test description',
  }];

  public geoTree: any[] = GeoTree;
  public treeListItems: TreeListItem[];
  public filterData: any[] = [
    { name: AppLocalization.Macroregion, key: 'macroregion' },
    { name: AppLocalization.Region, key: 'region' },
    { name: AppLocalization.Branch, key: 'branch' },
    { name: AppLocalization.ESO, key: 'eso' },
  ];

  @ViewChild('treelistCheckedPanel', { static: false }) treelistCheckedPanel: TreeListCheckedPanelComponent;
  treeLoadComplete = false;
  tabViewMode = false;
  loader = false;

  constructor() { }

  ngOnInit() {
    const treeListItems: TreeListItem[] = [];
    this.filterData.forEach((element) => {
        treeListItems.push(new TreeListItem(element.name));
    });
    this.treeListItems = treeListItems;
    this.loadTreeListView();
  }

  loadTreeListView() {
    this.loader = !(this.treeLoadComplete = false);
    of([])
      .pipe(
        delay(2000),
        finalize(() => this.loader = !(this.treeLoadComplete = true))
      )
      .subscribe();
  }
}
