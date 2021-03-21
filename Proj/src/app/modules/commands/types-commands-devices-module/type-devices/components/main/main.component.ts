import { AppLocalization } from 'src/app/common/LocaleRes';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { DataGrid, ActionButtons, ActionButtonConfirmSettings } from 'src/app/controls/DataGrid';
import { finalize } from 'rxjs/operators';

import { IDeviceType } from '../../../../../../services/data-query';
import { ReferenceDeviceCommandTypesService } from 'src/app/services/commands/Reference/reference-device-command-types.service';
import { Router } from '@angular/router';

@Component({
  selector: 'rom-commands-td-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.less']
})
export class CommandsTypeDevicesMainComponent implements OnInit {
  public loadingContent: boolean;
  public errors: any[] = [];
  public deviceTypes: IDeviceType[];

  @ViewChild('Ro5DataGrid', { static: true }) public dataGrid: DataGrid;
  @ViewChild('typeNameColumnTemplate', { static: true })
  private typeNameColumnTemplate: TemplateRef<any>;

  constructor(
    private refDevCommandTypeService: ReferenceDeviceCommandTypesService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadData();
  }

  private loadData() {
    this.loadingContent = true;
    this.refDevCommandTypeService
      .get()
      .pipe(finalize(() => (this.loadingContent = false)))
      .subscribe(
        (deviceTypes: IDeviceType[]) => {
          this.deviceTypes = deviceTypes;
          this.initDG();
        },
        error => {
          this.errors = [error];
        }
      );
  }

  private initDG() {
    this.dataGrid.initDataGrid();
    this.dataGrid.KeyField = 'Id';

    this.dataGrid.Columns = [
      {
        Name: 'Name',
        Caption: AppLocalization.Name,
        CellTemplate: this.typeNameColumnTemplate,
        AppendFilter: false,
        disableTextWrap: true
      },
      {
        Name: 'Code',
        Caption: AppLocalization.Code,
        AppendFilter: false,
        disableTextWrap: true
      }
    ];

    this.dataGrid.DataSource = this.deviceTypes;

    this.dataGrid.ActionButtons = [
      new ActionButtons(
        'Delete',
        AppLocalization.Delete,
        new ActionButtonConfirmSettings(
          AppLocalization.DeleteConfirm,
          AppLocalization.Delete
        )
      )
    ];
  }

  onActionButtonClicked(event: any) {
    const itemId = event.item.Id;
    this.loadingContent = true;
    this.deleteItem(itemId)
      .then(() => {
        this.dataGrid.DataSource = this.dataGrid.DataSource.filter(
          item => item.Id !== itemId
        );
        this.loadingContent = false;
      })
      .catch((error: any) => {
        this.errors.push(error);
        this.loadingContent = false;
      });
  }

  addNewDevice() {
    this.router.navigate(['commands-module/command-types/new']);
  }

  private deleteItem(itemId: number) {
    return this.refDevCommandTypeService.delete(itemId);
  }
}
