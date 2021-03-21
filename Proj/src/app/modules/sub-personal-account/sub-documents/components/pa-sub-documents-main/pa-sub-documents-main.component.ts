import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { DataGrid, DataColumnType } from 'src/app/controls/DataGrid';
import { finalize } from 'rxjs/operators';
import { ContextButtonItem } from '../../../../../controls/ContextButton/ContextButtonItem';

import { Router } from '@angular/router';
import { ICustomer } from 'src/app/services/sub-personal-account/models/Customer';
import { AppLocalization } from 'src/app/common/LocaleRes';
import { SubPersonalDocsFilterContainerService } from 'src/app/services/sub-personal-account/filters-docs/SubPersonalDocsFilterContainer.service';
import { SubscribersMainDocsService } from 'src/app/services/sub-personal-account/sub-docs-main.service';

@Component({
  selector: 'rom-pa-sub-documents-main',
  templateUrl: './pa-sub-documents-main.component.html',
  styleUrls: ['./pa-sub-documents-main.component.less'],
})
export class PaSubDocumentsMainComponent implements OnInit {
  public menuConfirmItem: any = null;
  public loadingContent: boolean;
  public errors: any[] = [];
  public dataSource: ICustomer[];
  public filterKey: string;
  public commandActions: ContextButtonItem[];

  @ViewChild('Ro5DataGrid', { static: true }) public dataGrid: DataGrid;
  @ViewChild('cellColumnTemplate', { static: true })
  private cellColumnTemplate: TemplateRef<any>;
  @ViewChild('directionColumnTemplate', { static: true })
  private directionColumnTemplate: TemplateRef<any>;
  @ViewChild('statusColumnTemplate', { static: true })
  private statusColumnTemplate: TemplateRef<any>;
  @ViewChild('docTypeColumnTemplate', { static: true })
  private docTypeColumnTemplate: TemplateRef<any>;
  @ViewChild('surnameColumnTemplate', { static: true })
  private customerColumnTemplate: TemplateRef<any>;
  @ViewChild('nameColumnTemplate', { static: true })
  private nameColumnTemplate: TemplateRef<any>;
  @ViewChild('viewedColumnTemplate', { static: true })
  private viewedColumnTemplate: TemplateRef<any>;

  constructor(
    public subPersonalDocsFilterContainerService: SubPersonalDocsFilterContainerService,
    private subMainService: SubscribersMainDocsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadData();
  }

  private loadData() {
    this.loadingContent = true;
    this.subMainService
      .getDocuments(this.filterKey)
      .pipe(finalize(() => (this.loadingContent = false)))
      .subscribe(
        (customers: ICustomer[]) => {
          this.dataSource = customers;
          this.initDG();
        },
        (error) => {
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
        CellTemplate: this.nameColumnTemplate,
      },
      {
        Name: 'Application',
        Caption: AppLocalization.PersonalAppName,
        CellTemplate: this.cellColumnTemplate,
      },
      {
        Name: 'DateTime',
        Caption: AppLocalization.DateTime,
        DataType: DataColumnType.DateTime,
      },
      {
        Name: 'Direction',
        Caption: AppLocalization.Direction,
        CellTemplate: this.directionColumnTemplate,
      },
      {
        Name: 'Customer',
        Caption: AppLocalization.Label111,
        CellTemplate: this.customerColumnTemplate,
      },
      {
        Name: 'Type',
        Caption: AppLocalization.DocumentType,
        CellTemplate: this.docTypeColumnTemplate,
      },
      {
        Name: 'Viewed',
        Caption: AppLocalization.ViewSign,
        DataType: DataColumnType.Boolean,
        CellTemplate: this.viewedColumnTemplate,
      },
      {
        Name: 'Status',
        Caption: AppLocalization.Status,
        CellTemplate: this.statusColumnTemplate,
      },
    ];

    this.dataGrid.DataSource = this.dataSource;
  }

  addNewItem() {
    this.router.navigate(['sub-personal-account/documents/new']);
  }

  onApplyFilter(guid: string): void {
    this.filterKey = guid;
    this.loadData();
  }
}
