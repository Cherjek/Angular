import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DataGrid } from 'src/app/controls/DataGrid';

@Component({
  selector: 'rom-header-template-cancel',
  templateUrl: './header-template-cancel.component.html',
  styleUrls: ['./header-template-cancel.component.less']
})
export class HeaderTemplateCancelComponent {
  @Input() dataGrid: DataGrid;
  @Input() permissionCancel: string | any;
  @Input() validDownload: boolean;
  @Output() cancelRows = new EventEmitter<any>();
  @Output() downloadSelect = new EventEmitter<any>();
  validForCancelList: any[];

  public deleteRows() {
    this.cancelRows.emit(this.validForCancelList);
  }

  checkValidForCancel() {
    this.validForCancelList = this.dataGrid
      .getSelectDataRows()
      .filter(data => data.IsEndState === false && data.Status !== 'Canceling');
  }

  downloadSelected() {
    this.downloadSelect.emit(this.dataGrid.getSelectDataRows());
  }
}
