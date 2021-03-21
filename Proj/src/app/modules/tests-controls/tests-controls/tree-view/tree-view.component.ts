import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit } from '@angular/core';
import { GeoTree } from '../GeoTree';
import { MatTreeActionButton, MatTreeActionButtonConfirmSettings } from 'src/app/shared/material-angular/mat-tree';

@Component({
  selector: 'rom-tree-view',
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.less']
})
export class TreeViewComponent implements OnInit {

  geoTree: any[] = GeoTree;
  matTreeActionButtons: MatTreeActionButton[];
  
  constructor() { }

  ngOnInit() {
    this.matTreeActionButtons = [
      new MatTreeActionButton('nodeUp', AppLocalization.MoveUp + ' &uarr;'),
      new MatTreeActionButton('nodeDown', AppLocalization.MoveDown + ' &darr;'),
      new MatTreeActionButton('createNodeChild', AppLocalization.CreateAChild),
      new MatTreeActionButton('delete', AppLocalization.Delete, new MatTreeActionButtonConfirmSettings(AppLocalization.DeleteNodeAlert, AppLocalization.RemoveTheNode))
    ];
  }

}
